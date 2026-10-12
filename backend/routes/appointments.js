const express = require('express');
const router = express.Router();
const { run, all, get } = require('../database');

/**
 * GET /api/appointments
 * Fetch all appointments joined with doctor details
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.patient_name,
        a.patient_age,
        a.patient_phone,
        a.doctor_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.consultation_fee AS consultation_fee,
        d.fee AS fee
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time ASC
    `;

    const appointments = await all(query);
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments list.',
      error: error.message
    });
  }
});

/**
 * POST /api/appointments
 * Book a new appointment
 * Accepts both camelCase and snake_case request body keys
 */
router.post('/', async (req, res) => {
  try {
    const patient_name = req.body.patient_name || req.body.patientName;
    const patient_age = req.body.patient_age || req.body.patientAge || 30;
    const patient_phone = req.body.patient_phone || req.body.patientPhone || '555-0100';
    const doctor_id = req.body.doctor_id || req.body.doctorId;
    const appointment_date = req.body.appointment_date || req.body.date;
    const appointment_time = req.body.appointment_time || req.body.time;

    // Field validation
    if (!patient_name || typeof patient_name !== 'string' || !patient_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Patient name is required and cannot be empty.'
      });
    }

    if (!patient_phone || typeof patient_phone !== 'string' || !patient_phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Valid patient phone number is required.'
      });
    }

    if (patient_age && (isNaN(patient_age) || Number(patient_age) <= 0 || Number(patient_age) > 130)) {
      return res.status(400).json({
        success: false,
        message: 'Patient age must be between 1 and 130.'
      });
    }

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: 'Please select a doctor for the appointment.'
      });
    }

    if (!appointment_date) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date is required.'
      });
    }

    if (!appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Appointment time slot is required.'
      });
    }

    // Verify doctor exists
    const doctor = await get('SELECT id, name FROM doctors WHERE id = ?', [doctor_id]);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Selected doctor (ID: ${doctor_id}) does not exist.`
      });
    }

    // Double-booking conflict check (HTTP 409 Conflict)
    const existingBooking = await get(`
      SELECT id, patient_name, appointment_date, appointment_time 
      FROM appointments 
      WHERE doctor_id = ? 
        AND appointment_date = ? 
        AND appointment_time = ? 
        AND status != 'Cancelled'
    `, [doctor_id, appointment_date, appointment_time]);

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `Slot Conflict: ${appointment_time} on ${appointment_date} is already booked for ${doctor.name}. Please select another time or date.`
      });
    }

    // Insert appointment record
    const result = await run(`
      INSERT INTO appointments (patient_name, patient_age, patient_phone, doctor_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
    `, [patient_name.trim(), parseInt(patient_age, 10), patient_phone.trim(), doctor_id, appointment_date, appointment_time]);

    // Retrieve created appointment with doctor details
    const createdAppointment = await get(`
      SELECT 
        a.id,
        a.patient_name,
        a.patient_age,
        a.patient_phone,
        a.doctor_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.consultation_fee AS consultation_fee
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [result.id]);

    res.status(201).json({
      success: true,
      appointmentId: result.id,
      status: 'CONFIRMED',
      message: 'Appointment booked successfully',
      data: createdAppointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment. Please try again.',
      error: error.message
    });
  }
});

/**
 * PATCH /api/appointments/:id/cancel
 * Cancel an appointment
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id, 10);
    if (isNaN(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID provided.'
      });
    }

    const appointment = await get('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `Appointment #${appointmentId} was not found.`
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been cancelled.'
      });
    }

    await run("UPDATE appointments SET status = 'Cancelled' WHERE id = ?", [appointmentId]);

    const updated = await get(`
      SELECT 
        a.id,
        a.patient_name,
        a.patient_age,
        a.patient_phone,
        a.doctor_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [appointmentId]);

    res.status(200).json({
      success: true,
      message: `Appointment #${appointmentId} cancelled successfully.`,
      data: updated
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment.',
      error: error.message
    });
  }
});

module.exports = router;

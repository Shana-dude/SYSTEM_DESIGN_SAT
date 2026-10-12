const express = require('express');
const router = express.Router();
const { all, get } = require('../database');

/**
 * GET /api/prescriptions
 * Fetch all sample prescriptions
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.patient_id,
        p.patient_name,
        p.doctor_id,
        p.consultation_date,
        p.diagnosis,
        p.medicines,
        p.dosage,
        p.instructions,
        p.is_demo,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.contact_email AS doctor_email
      FROM prescriptions p
      LEFT JOIN doctors d ON p.doctor_id = d.id
      ORDER BY p.id ASC
    `;

    const rows = await all(query);
    const parsed = rows.map(r => ({
      ...r,
      medicines: JSON.parse(r.medicines || '[]'),
      is_demo: Boolean(r.is_demo)
    }));

    res.status(200).json({
      success: true,
      count: parsed.length,
      data: parsed
    });
  } catch (error) {
    console.error('Error retrieving prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve prescriptions.',
      error: error.message
    });
  }
});

/**
 * GET /api/prescriptions/:patientId
 * Retrieve prescription for a given patient ID or sample identifier
 */
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const query = `
      SELECT 
        p.id,
        p.patient_id,
        p.patient_name,
        p.doctor_id,
        p.consultation_date,
        p.diagnosis,
        p.medicines,
        p.dosage,
        p.instructions,
        p.is_demo,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.contact_email AS doctor_email
      FROM prescriptions p
      LEFT JOIN doctors d ON p.doctor_id = d.id
      WHERE LOWER(p.patient_id) = LOWER(?) OR LOWER(p.patient_name) LIKE LOWER(?)
      ORDER BY p.id DESC
      LIMIT 1
    `;

    let prescription = await get(query, [patientId, `%${patientId}%`]);

    // Fallback for demo, sample, or default lookups
    if (!prescription && (patientId === 'demo' || patientId === 'sample' || patientId === 'default' || patientId === '1')) {
      prescription = await get(`
        SELECT 
          p.id,
          p.patient_id,
          p.patient_name,
          p.doctor_id,
          p.consultation_date,
          p.diagnosis,
          p.medicines,
          p.dosage,
          p.instructions,
          p.is_demo,
          d.name AS doctor_name,
          d.specialization AS doctor_specialization,
          d.contact_email AS doctor_email
        FROM prescriptions p
        LEFT JOIN doctors d ON p.doctor_id = d.id
        ORDER BY p.id ASC
        LIMIT 1
      `);
    }

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: `No prescription record found for patient ID: ${patientId}.`
      });
    }

    const formatted = {
      ...prescription,
      medicines: JSON.parse(prescription.medicines || '[]'),
      is_demo: Boolean(prescription.is_demo)
    };

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error retrieving prescription by patientId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve prescription.',
      error: error.message
    });
  }
});

module.exports = router;

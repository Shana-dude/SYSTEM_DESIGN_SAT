/**
 * MediCare API Client
 * Centralized service layer for communicating with the Express backend.
 */

const API_BASE_URL = '/api';

/**
 * Handle API responses and uniform error extraction
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `HTTP ${response.status}: Request failed`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

/**
 * Fetch all doctors with optional search or specialization filters
 */
export async function getDoctors(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.specialization && params.specialization !== 'All') {
    query.append('specialization', params.specialization);
  }

  const url = `${API_BASE_URL}/doctors${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

/**
 * Fetch single doctor details by ID
 */
export async function getDoctorById(id) {
  const res = await fetch(`${API_BASE_URL}/doctors/${id}`);
  return handleResponse(res);
}

/**
 * Fetch all appointments
 */
export async function getAppointments() {
  const res = await fetch(`${API_BASE_URL}/appointments`);
  return handleResponse(res);
}

/**
 * Book a new appointment
 * @param {Object} appointmentData { patient_name, patient_age, patient_phone, doctor_id, appointment_date, appointment_time }
 */
export async function bookAppointment(appointmentData) {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(res);
}

/**
 * Cancel an appointment by ID
 */
export async function cancelAppointment(id) {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

/**
 * Fetch sample digital prescription for a patient
 */
export async function getPrescription(patientId = 'demo') {
  const res = await fetch(`${API_BASE_URL}/prescriptions/${encodeURIComponent(patientId)}`);
  return handleResponse(res);
}

/**
 * Fetch all prescriptions
 */
export async function getAllPrescriptions() {
  const res = await fetch(`${API_BASE_URL}/prescriptions`);
  return handleResponse(res);
}

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  return handleResponse(res);
}

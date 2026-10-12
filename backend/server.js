const express = require('express');
const cors = require('cors');
const { get } = require('./database');

// Import modular routes
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');
const prescriptionsRoutes = require('./routes/prescriptions');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local Vite development and external frontends
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser for JSON
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root API information
app.get('/', (req, res) => {
  res.json({
    name: 'MediCare – Doctor Appointment System API',
    status: 'online',
    version: '1.0.0',
    documentation: 'See README.md for endpoint specifications',
    endpoints: {
      doctors: '/api/doctors',
      doctorDetails: '/api/doctors/:id',
      appointments: '/api/appointments',
      bookAppointment: 'POST /api/appointments',
      cancelAppointment: 'PATCH /api/appointments/:id/cancel',
      prescriptions: '/api/prescriptions',
      patientPrescription: '/api/prescriptions/:patientId',
      dashboardStats: '/api/stats'
    }
  });
});

// Mount Routes
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);

// Dashboard Statistics Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const totalDoctorsRow = await get('SELECT COUNT(*) AS count FROM doctors');
    const totalAppointmentsRow = await get('SELECT COUNT(*) AS count FROM appointments');
    const confirmedRow = await get("SELECT COUNT(*) AS count FROM appointments WHERE status = 'Confirmed'");
    const cancelledRow = await get("SELECT COUNT(*) AS count FROM appointments WHERE status = 'Cancelled'");

    res.status(200).json({
      success: true,
      data: {
        totalDoctors: totalDoctorsRow ? totalDoctorsRow.count : 0,
        availableDoctors: totalDoctorsRow ? totalDoctorsRow.count : 0,
        totalAppointments: totalAppointmentsRow ? totalAppointmentsRow.count : 0,
        confirmedAppointments: confirmedRow ? confirmedRow.count : 0,
        cancelledAppointments: cancelledRow ? cancelledRow.count : 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats.',
      error: error.message
    });
  }
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.url}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: err.message
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🏥 MediCare Backend running on: http://localhost:${PORT}`);
  console.log(`📄 Doctors API:       http://localhost:${PORT}/api/doctors`);
  console.log(`📅 Appointments API:  http://localhost:${PORT}/api/appointments`);
  console.log(`💊 Prescriptions API: http://localhost:${PORT}/api/prescriptions`);
  console.log(`📊 Stats API:         http://localhost:${PORT}/api/stats`);
  console.log('========================================================');
});

module.exports = app;

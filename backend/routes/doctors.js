const express = require('express');
const router = express.Router();
const { all, get } = require('../database');

/**
 * GET /api/doctors
 * Fetch all doctors with optional search and specialization filters
 */
router.get('/', async (req, res) => {
  try {
    const { search, specialization } = req.query;

    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR specialization LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (specialization && specialization !== 'All') {
      query += ' AND specialization = ?';
      params.push(specialization.trim());
    }

    query += ' ORDER BY rating DESC, name ASC';

    const doctors = await all(query, params);
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Error retrieving doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors list.',
      error: error.message
    });
  }
});

/**
 * GET /api/doctors/:id
 * Fetch doctor by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id, 10);
    if (isNaN(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID provided.'
      });
    }

    const doctor = await get('SELECT * FROM doctors WHERE id = ?', [doctorId]);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${doctorId} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error retrieving doctor details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctor details.',
      error: error.message
    });
  }
});

module.exports = router;

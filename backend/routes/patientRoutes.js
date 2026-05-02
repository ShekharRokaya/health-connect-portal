const express = require('express');
const { getDoctors, bookAppointment, getAppointments } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/doctors', protect, getDoctors);
router.post('/appointments', protect, bookAppointment);
router.get('/appointments', protect, getAppointments);

module.exports = router;

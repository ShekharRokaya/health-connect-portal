const express = require('express');
const { updateProfile, getAppointments, updateAppointmentStatus, getProfile, addPrescription } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, authorize('doctor'), getProfile);
router.put('/profile', protect, authorize('doctor'), updateProfile);
router.get('/appointments', protect, authorize('doctor'), getAppointments);
router.put('/appointments/:id', protect, authorize('doctor'), updateAppointmentStatus);
router.put('/appointments/:id/prescription', protect, authorize('doctor'), addPrescription);

module.exports = router;

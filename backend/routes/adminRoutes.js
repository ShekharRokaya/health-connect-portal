const express = require('express');
const { getAllUsers, approveDoctor, getStats, getAllDoctors, deleteUser, getAllAppointments, getAllEmergencies } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/doctors', protect, authorize('admin'), getAllDoctors);
router.put('/doctor/approve/:id', protect, authorize('admin'), approveDoctor);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/appointments', protect, authorize('admin'), getAllAppointments);
router.get('/emergencies', protect, authorize('admin'), getAllEmergencies);

module.exports = router;

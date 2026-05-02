const express = require('express');
const { getAllUsers, approveDoctor, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/doctor/approve/:id', protect, authorize('admin'), approveDoctor);
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;

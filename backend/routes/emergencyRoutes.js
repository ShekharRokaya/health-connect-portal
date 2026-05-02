const express = require('express');
const { createEmergency, getMyEmergencies, getEmergencies, respondEmergency } = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorize('patient'), createEmergency);
router.get('/mine', protect, authorize('patient'), getMyEmergencies);
router.get('/', protect, authorize('doctor', 'admin'), getEmergencies);
router.put('/:id/respond', protect, authorize('doctor'), respondEmergency);

module.exports = router;

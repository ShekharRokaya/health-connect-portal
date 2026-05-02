const Emergency = require('../models/Emergency');

const createEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.create({
            patient: req.user._id,
            message: req.body.message || 'Emergency! Patient needs immediate medical attention.',
            location: req.body.location || ''
        });

        const populated = await Emergency.findById(emergency._id).populate('patient', 'name email');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyEmergencies = async (req, res) => {
    try {
        const emergencies = await Emergency.find({ patient: req.user._id })
            .populate('respondedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmergencies = async (req, res) => {
    try {
        const emergencies = await Emergency.find({ status: 'active' })
            .populate('patient', 'name email')
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const respondEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

        emergency.status = 'responded';
        emergency.respondedBy = req.user._id;
        await emergency.save();

        const populated = await Emergency.findById(emergency._id)
            .populate('patient', 'name email')
            .populate('respondedBy', 'name email');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEmergency, getMyEmergencies, getEmergencies, respondEmergency };

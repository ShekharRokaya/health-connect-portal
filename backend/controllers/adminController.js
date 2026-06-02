const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        doctor.isApproved = true;
        await doctor.save();
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const doctorsCount = await Doctor.countDocuments();
        const appointmentsCount = await Appointment.countDocuments();
        res.json({ usersCount, doctorsCount, appointmentsCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).populate('user', 'name email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // If doctor, delete doctor profile too
        if (user.role === 'doctor') {
            await Doctor.findOneAndDelete({ user: user._id });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('patient', 'name email')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEmergencies = async (req, res) => {
    try {
        const Emergency = require('../models/Emergency'); // Dynamic require if not imported
        const emergencies = await Emergency.find({})
            .populate('patient', 'name email')
            .populate('respondedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, approveDoctor, getStats, getAllDoctors, deleteUser, getAllAppointments, getAllEmergencies };

const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const getProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { specialization, experience, fees, availableTimeSlots } = req.body;
        let doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            doctor = await Doctor.create({
                user: req.user._id,
                specialization, experience, fees, availableTimeSlots
            });
        } else {
            doctor.specialization = specialization || doctor.specialization;
            doctor.experience = experience || doctor.experience;
            doctor.fees = fees || doctor.fees;
            if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;
            await doctor.save();
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email').sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPrescription = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.prescription = req.body.prescription;
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateProfile, getAppointments, updateAppointmentStatus, getProfile, addPrescription };

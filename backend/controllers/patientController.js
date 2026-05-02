const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isApproved: true }).populate('user', 'name email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const isBooked = await Appointment.findOne({ doctor: doctorId, date, time, status: { $in: ['pending', 'approved'] } });
        if (isBooked) return res.status(400).json({ message: 'Time slot already booked' });

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date,
            time,
            reason
        });

        // Mark the time slot as booked in the Doctor's profile (if it was an exact slot match)
        if (doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0) {
            const slot = doctor.availableTimeSlots.find(s =>
                new Date(s.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0] && s.time === time
            );
            if (slot) {
                slot.isBooked = true;
                await doctor.save();
            }
        }

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor')
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
            .sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDoctors, bookAppointment, getAppointments };

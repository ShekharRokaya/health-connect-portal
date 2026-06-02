const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    isApproved: { type: Boolean, default: false },
    availableTimeSlots: [{
        date: { type: Date, required: true },
        time: { type: String, required: true }, // e.g., "10:00 AM"
        isBooked: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;

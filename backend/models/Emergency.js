const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: 'Emergency! Patient needs immediate medical attention.' },
    location: { type: String, default: '' },
    status: { type: String, enum: ['active', 'responded', 'resolved'], default: 'active' },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
    timestamps: true
});

const Emergency = mongoose.model('Emergency', emergencySchema);
module.exports = Emergency;

const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    contactMethod: { type: String, enum: ['email', 'phone', 'whatsapp'], default: 'email' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    program: { type: String, required: true },
    city: { type: String, required: true },
    enrollmentDate: { type: String }, // Keeping as string for flexibility, or Date if strict
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

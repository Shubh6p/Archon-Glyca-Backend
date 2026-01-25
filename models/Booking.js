const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    appointmentRegarding: { 
        type: String, 
        // These MUST match the <option> values in appoitment.html exactly
        enum: [
            'Zumba', 
            'Aerobics', 
            'Yoga', 
            'HIIT Training', 
            'Kettlebell Workout', 
            'Diabetes Management Training', 
            'Pilates', 
            'Weight Training'
        ],
        required: true 
    },
    preferredLanguage: { type: String, enum: ['Hindi', 'English'], required: true },
    date: { type: String, required: true }, 
    status: { type: String, default: 'Confirmed' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
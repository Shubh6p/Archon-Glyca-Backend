const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    specialization: { type: String },
    bio: { type: String },
    isProfileComplete: { type: Boolean, default: false },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    otp: { type: String },
    otpExpires: { type: Date }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coach', CoachSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // --- 00: Authentication & Account Status ---
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

    // --- 01: Core Identity & Metrics ---
    fullName: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    heightCm: { type: Number },
    weightKg: { type: Number },

    // --- 02: Performance Objective ---
    primaryGoal: { 
        type: String, 
        enum: [
            'fat-loss', 
            'weight-loss',
            'diabetic', 
            'strength', 
            'hiit', 
            'yoga', 
            'aerobics', 
            'kettlebell',
            'zumba', 
            'pilates'

        ] 
    },
    experienceLevel: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced / Elite'] 
    },
    pastInjuries: { type: String, trim: true },

    // This object will store all the specific fields from your dynamic sections
    profileDetails: {
        // FAT LOSS FIELDS
        targetWeightKg: Number,
        waistCm: Number,
        hipCm: Number,
        bodyFatPercentage: Number,

        // DIABETIC REVERSAL FIELDS
        diabetesType: String,
        diagnosisDate: String,
        fastingSugar: Number,
        postMealSugar: Number,
        hba1c: Number,
        bloodPressure: String,
        familyHistory: String,

        // FULL BODY STRENGTH FIELDS
        gymAccess: String,
        homeEquipment: String,

        // HIIT FIELDS
        cardioEndurance: String,
        canDoPushups: String,
        canDoSquats: String,
        maxPlankSeconds: Number,

        // YOGA FIELDS
        yogaGoals: String,
        physicalLimits: String,

        // AEROBICS FIELDS
        canJog5Mins: String,
        coordinationLevel: String,
        kneeBalanceIssues: String,

        // KETTLEBELL FIELDS
        usedKettlebellsBefore: String,
        preferredWeightKg: Number,
        gripStrength: String,

        // PILATES FIELDS
        pilatesGoals: String,
        postPregnancyPelvicIssues: String
    }
}, { 
    minimize: false, // Ensures empty profile objects are still saved
    timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
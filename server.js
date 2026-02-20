require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// --- Firewall (Rate Limiting) ---
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts. Please wait 15 minutes.' }
});


// Import Route Handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const contactRoutes = require('./routes/contact');
const feedbackRoutes = require('./routes/feedback');


const app = express();
app.use(generalLimiter);

// --- Middleware Configuration ---
app.use(express.json()); // Parses incoming JSON payloads
app.use(cors()); // Enables Cross-Origin Resource Sharing for your frontend
app.use(express.static(path.join(__dirname, 'public'))); // Serves your HTML files (index, profile, etc.)

// --- MongoDB Connection (Clinical Vault) ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connection Established to MongoDB Database'))
    .catch(err => {
        console.error('❌ Connection Failed: Could not connect to MongoDB', err);
        process.exit(1); // Exit if database is unreachable
    });

// --- API Route Definitions ---
// Authentication: Handles OTP requesting and verification logic
app.use('/api/auth', authLimiter, authRoutes);

// User Management: Handles bio-data saving and profile status checks
app.use('/api/user', userRoutes);

// 1. Import the booking route handler
const bookingRoutes = require('./routes/booking'); // Ensure this file exists in your routes folder

// ... after your existing app.use definitions ...

// 2. Register the Booking API
app.use('/api/booking', bookingRoutes);

app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'System Error: Server Interrupted',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Archon Glyca Server is active on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
});
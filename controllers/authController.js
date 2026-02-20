const User = require('../models/User');
const Coach = require('../models/Coach');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// Configure your email transporter (Gmail Example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use an App Password, not your regular password
    }
});

// 1. Send OTP (Login / Signup)
exports.requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 600000; // 10 Minutes

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await transporter.sendMail({
            to: email,
            subject: 'Arcohn Glyca | Your Secure Access Code',
            html: `<div style="background:#050505; color:white; padding:40px; text-align:center; font-family:sans-serif;">
                    <h1 style="color:#D4FF00 italic">Arcohn Glyca</h1>
                    <p style="font-size:18px">Your OTP for secure access is:</p>
                    <h2 style="letter-spacing:10px; font-size:40px; color:#D4FF00">${otp}</h2>
                    <p>This code expires in 10 minutes.</p>
                   </div>`
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

// 2. Verify OTP & Handle Redirection
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP and verify user
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            message: 'Verification successful',
            userId: user._id,
            isProfileComplete: user.isProfileComplete,
            // Change these to the folder paths
            redirectTo: user.isProfileComplete ? '/' : '/profile'
        });
    } catch (error) {
        res.status(500).json({ message: 'Verification error', error: error.message });
    }
};

// 3. Admin: Request OTP (Only for existing coaches)
exports.requestAdminOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check if email exists in Coach collection
        const coach = await Coach.findOne({ email: email.toLowerCase() });
        if (!coach) {
            return res.status(403).json({ message: 'Access Denied: Restricted Area' });
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 600000; // 10 Minutes

        coach.otp = otp;
        coach.otpExpires = otpExpires;
        await coach.save();

        // 3. Send Email
        await transporter.sendMail({
            to: email,
            subject: 'ARCHON CONSOLE | Security Access Code',
            html: `
                <div style="background:#050505; color:white; padding:60px 20px; text-align:center; font-family:'Space Grotesk', sans-serif;">
                    <h1 style="color:#D4FF00; font-size:12px; text-transform:uppercase; letter-spacing:8px; margin-bottom:40px;">Archon Console Access</h1>
                    <div style="max-width:400px; margin:0 auto; background:#111; border:1px solid #1F1F1F; padding:40px; border-radius:32px;">
                        <p style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#444; margin-bottom:20px;">Identity Verification Code</p>
                        <h2 style="letter-spacing:15px; font-size:48px; color:#D4FF00; margin:0; font-weight:900;">${otp}</h2>
                        <p style="font-size:10px; color:#444; margin-top:20px; text-transform:uppercase; letter-spacing:1px;">Expires in 10 minutes</p>
                    </div>
                </div>`
        });

        res.status(200).json({ message: 'Admin OTP sent successfully' });
    } catch (error) {
        console.error("Admin OTP Request Error:", error);
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

// 4. Admin: Verify OTP
exports.verifyAdminOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const coach = await Coach.findOne({
            email: email.toLowerCase(),
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!coach) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP
        coach.otp = undefined;
        coach.otpExpires = undefined;
        await coach.save();

        // GENERATE SECURE JWT
        const token = jwt.sign(
            {
                id: coach._id,
                email: coach.email,
                role: 'coach'
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // 7 Day Expiry as requested
        );

        res.status(200).json({
            message: 'Admin access authorized',
            token: token,
            email: coach.email,
            isAdmin: true
        });

    } catch (error) {
        console.error("Admin OTP Verification Error:", error);
        res.status(500).json({ message: 'Verification error', error: error.message });
    }
};

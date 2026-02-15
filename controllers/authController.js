const User = require('../models/User');
const nodemailer = require('nodemailer');

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

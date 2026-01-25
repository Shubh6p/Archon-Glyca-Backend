const User = require('../models/User');

// Save all Bio-Metrics from profile.html
exports.completeProfile = async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;
        // This findByIdAndUpdate will merge the new profileData into MongoDB
        const user = await User.findByIdAndUpdate(userId, {
            ...profileData,
            isProfileComplete: true
        }, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Profile authorized and saved', user });
    } catch (error) {
        res.status(500).json({ message: 'Error saving profile', error: error.message });
    }
};

// Check status before booking appointment
exports.getStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ isProfileComplete: user.isProfileComplete });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching status' });
    }
};

// controllers/userController.js
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};
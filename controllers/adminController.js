const User = require('../models/User');
const Appointment = require('../models/Booking');

exports.getLabOverview = async (req, res) => {
    try {
        // Fetch all users who have completed their bio-data
        const clients = await User.find({ isProfileComplete: true }).sort({ updatedAt: -1 });
        
        // Fetch upcoming appointments
        const appointments = await Appointment.find()
            .populate('userId', 'fullName email contactNumber')
            .sort({ date: 1, timeSlot: 1 });

        res.status(200).json({ clients, appointments });
    } catch (error) {
        res.status(500).json({ message: 'Oversight Error', error: error.message });
    }
};
const jwt = require('jsonwebtoken');
const Coach = require('../models/Coach');

const protectAdmin = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is a valid coach
        const coach = await Coach.findById(decoded.id).select('-otp -otpExpires');

        if (!coach) {
            return res.status(403).json({ message: 'Access Denied: Admin privileges required' });
        }

        req.admin = coach;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protectAdmin };

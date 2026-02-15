const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to save full bio-metrics
router.post('/complete-profile', userController.completeProfile);

// Route to check if profile is filled before booking
router.get('/status/:id', userController.getStatus);

// routes/user.js
router.get('/:id', userController.getProfile);

module.exports = router;
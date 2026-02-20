const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/send', contactController.sendContactMessage);

// Admin Only Routes
router.get('/all', protectAdmin, contactController.getAllContacts);


module.exports = router;
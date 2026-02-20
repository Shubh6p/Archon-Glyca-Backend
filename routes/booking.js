const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/book', bookingController.bookSession);
router.get('/slots/:date', bookingController.getOccupiedSlots);

// Admin Only Routes
router.get('/all', protectAdmin, bookingController.getAllBookings);


module.exports = router;
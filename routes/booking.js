const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/book', bookingController.bookSession);
router.get('/slots/:date', bookingController.getOccupiedSlots);

module.exports = router;
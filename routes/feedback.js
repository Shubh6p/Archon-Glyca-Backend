const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/submit', feedbackController.submitFeedback);
router.get('/approved', feedbackController.getApprovedFeedback);

// Admin Only Routes
router.get('/all', protectAdmin, feedbackController.getAllFeedback);
router.patch('/status/:id', protectAdmin, feedbackController.updateFeedbackStatus);

module.exports = router;

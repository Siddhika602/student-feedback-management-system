const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getMyFeedback,
  getFeedbackForStudent
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitFeedback);
router.get('/my', protect, getMyFeedback);
router.get('/student/:studentId', getFeedbackForStudent);

module.exports = router;

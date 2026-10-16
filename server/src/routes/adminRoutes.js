const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
  exportFeedbackCSV
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here require Admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id', updateFeedback);
router.delete('/feedback/:id', deleteFeedback);
router.get('/export-csv', exportFeedbackCSV);

module.exports = router;

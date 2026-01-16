const express = require('express');
const router = express.Router();
const {
  getRecords,
  getSummary,
  createRecord
} = require('../controllers/financialController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getRecords);
router.get('/reports/summary', protect, authorize('admin'), getSummary);
router.post('/', protect, authorize('admin'), createRecord);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  recordProjectPayment
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.post('/', protect, authorize('admin'), createProject);
router.get('/:id', protect, getProject);
router.put('/:id', protect, updateProject);
router.put('/:id/status', protect, updateProjectStatus);
router.post('/:id/payment', protect, authorize('admin'), recordProjectPayment);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;

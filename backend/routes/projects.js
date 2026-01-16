const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  updateProjectStatus
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.post('/', protect, authorize('admin'), createProject);
router.get('/:id', protect, getProject);
router.put('/:id', protect, updateProject);
router.put('/:id/status', protect, updateProjectStatus);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;

const Financial = require('../models/Financial');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all financial records
// @route   GET /api/financial
// @access  Private/Admin
const getRecords = async (req, res) => {
  try {
    const records = await Financial.find()
      .populate('project', 'title')
      .populate('user', 'name')
      .sort('-transactionDate');

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get financial summary for admin dashboard
// @route   GET /api/financial/reports/summary
// @access  Private/Admin
const getSummary = async (req, res) => {
  try {
    // 1. Total Revenue (Income)
    const incomeRecords = await Financial.find({ type: 'income', status: 'completed' });
    const totalRevenue = incomeRecords.reduce((acc, record) => acc + record.amount, 0);

    // 2. Total Users
    const totalUsers = await User.countDocuments();

    // 3. Total Projects
    const totalProjects = await Project.countDocuments();

    // 4. Pending Projects
    const pendingProjects = await Project.countDocuments({ status: 'pending' });

    // 5. Recent Projects
    const recentProjects = await Project.find()
      .populate('assignedTo', 'name')
      .sort('-createdAt')
      .limit(5);

    // 6. Recent Financial Records (Payments)
    const recentPayments = await Financial.find()
      .populate('user', 'name')
      .populate('project', 'title')
      .sort('-transactionDate')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalUsers,
        totalProjects,
        pendingProjects,
        recentProjects,
        recentPayments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create financial record
// @route   POST /api/financial
// @access  Private/Admin
const createRecord = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const record = await Financial.create(req.body);
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getRecords,
  getSummary,
  createRecord
};

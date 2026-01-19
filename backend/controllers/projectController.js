const Project = require('../models/Project');
const Financial = require('../models/Financial');
const User = require('../models/User');
const { sendProjectAssignmentEmail } = require('../mailtrap/email');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let query;
    // If admin, show all projects. If writer, show assigned projects.
    if (req.user.role === 'admin') {
      query = Project.find().populate('assignedTo', 'name email');
    } else {
      query = Project.find({ assignedTo: req.user._id });
    }

    const projects = await query.sort('-createdAt');
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      client,
      assignedTo,
      deadline,
      clientPrice,
      writerPrice,
      priority,
      category,
      wordCount
    } = req.body;

    // Validation
    if (!title || !description || !client?.name || !assignedTo || !deadline || clientPrice === undefined || writerPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, client name, assignedTo, deadline, clientPrice, writerPrice'
      });
    }

    // Validate prices
    const clientPriceNum = Number(clientPrice);
    const writerPriceNum = Number(writerPrice);

    if (isNaN(clientPriceNum) || clientPriceNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Client price must be a valid positive number'
      });
    }

    if (isNaN(writerPriceNum) || writerPriceNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Writer price must be a valid positive number'
      });
    }

    // Check if assigned writer exists and is active
    const writer = await User.findById(assignedTo);
    if (!writer) {
      return res.status(400).json({
        success: false,
        message: 'Assigned writer not found'
      });
    }

    if (!writer.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Assigned writer is not active'
      });
    }

    if (writer.role !== 'writer') {
      return res.status(400).json({
        success: false,
        message: 'Only writers can be assigned to projects'
      });
    }

    // Validate deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deadline date'
      });
    }

    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future'
      });
    }

    // Create project data
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      client: {
        name: client.name.trim(),
        email: client.email ? client.email.trim().toLowerCase() : undefined,
        phone: client.phone ? client.phone.trim() : undefined
      },
      assignedTo,
      assignedBy: req.user._id,
      deadline: deadlineDate,
      clientPrice: clientPriceNum,
      writerPrice: writerPriceNum,
      priority: priority || 'medium',
      category: category || 'academic-writing',
      budget: {
        amount: clientPriceNum,
        currency: 'NGN'
      }
    };

    // Add optional word count if provided
    if (wordCount !== undefined) {
      const wordCountNum = Number(wordCount);
      if (!isNaN(wordCountNum) && wordCountNum > 0) {
        projectData.wordCount = wordCountNum;
      }
    }

    // Create project
    const project = await Project.create(projectData);

    // Send assignment email to writer
    try {
      await sendProjectAssignmentEmail(
        writer.email,
        writer.name,
        project.title,
        project.deadline.toLocaleDateString(),
        project._id
      );
    } catch (emailError) {
      console.error('Error sending assignment email:', emailError);
      // Don't fail project creation if email fails
    }

    // Create financial records
    try {
      await Promise.all([
        Financial.create({
          type: 'income',
          category: 'project-payment',
          amount: project.clientPrice,
          description: `Revenue from project: ${project.title}`,
          project: project._id,
          createdBy: req.user._id,
          status: 'pending',
          transactionDate: new Date()
        }),
        Financial.create({
          type: 'expense',
          category: 'writer-payment',
          amount: project.writerPrice,
          description: `Payment to writer for project: ${project.title}`,
          project: project._id,
          user: project.assignedTo,
          createdBy: req.user._id,
          status: 'pending',
          transactionDate: new Date()
        })
      ]);
    } catch (financialError) {
      console.error('Error creating financial records:', financialError);
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: messages.join(', ')
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        error: `Invalid ${error.path}: ${error.value}`
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry',
        error: 'A project with similar data already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if authorized (admin or assigned writer)
    if (req.user.role !== 'admin' && project.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if authorized
    if (req.user.role !== 'admin' && project.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private
const updateProjectStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }

    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if authorized (admin or assigned writer)
    if (req.user.role !== 'admin' && project.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project.status = status;
    if (status === 'completed') {
      project.completedAt = Date.now();
      project.progress = 100;
    } else if (status === 'Chapter 1 Completed') {
      project.progress = 30;
    } else if (status === 'Chapter 2 Done') {
      project.progress = 60;
    } else if (status === 'in-progress') {
      project.progress = 10;
    } else if (status === 'cancelled') {
      project.cancellationReason = cancellationReason || 'No reason provided';
      // Also cancel associated financial records
      try {
        await Financial.updateMany(
          { project: project._id },
          { status: 'cancelled', notes: `Cancelled due to project cancellation: ${project.cancellationReason}` }
        );
      } catch (finError) {
        console.error('Error cancelling financial records:', finError);
      }
    }

    await project.save();

    res.status(200).json({
      success: true,
      data: project
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
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  updateProjectStatus
};

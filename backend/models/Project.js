const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email'
      }
    },
    phone: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project must be assigned to a writer']
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'Chapter 1 Completed', 'Chapter 2 Done', 'Chapter 3 Done', 'Chapter 4 Done', 'Chapter 5 Done', 'in-progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['academic-writing', 'research', 'editing', 'proofreading', 'consultation', 'other'],
    default: 'academic-writing'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  wordCount: {
    type: Number,
    min: [1, 'Word count must be at least 1']
  },
  budget: {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'NGN'
    }
  },
  clientPrice: {
    type: Number,
    required: [true, 'Client price is required'],
    min: [0, 'Client price cannot be negative']
  },
  writerPrice: {
    type: Number,
    required: [true, 'Writer price is required'],
    min: [0, 'Writer price cannot be negative']
  },
  referralPrice: {
    type: Number,
    min: [0, 'Referral price cannot be negative'],
    default: 0
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  completedAt: Date
}, {
  timestamps: true // Replaces manual hooks
});

// Index for better query performance
projectSchema.index({ assignedTo: 1, status: 1 });
projectSchema.index({ deadline: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);

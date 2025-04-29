const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  funFact: {
    type: String,
    default: ''
  },
  joinDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  university: {
    type: String,
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  resumeUrl: {
    type: String
  },
  documents: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Intern'
  },
  techStacks: [{
    type: String,
    trim: true
  }],
  assignedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  performance: {
    rating: {
      type: String,
      default: '4.0'
    },
    sprints: {
      type: Number,
      default: 1
    },
    projects: [{
      id: Number,
      name: String,
      description: String,
      status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
      }
    }],
    courses: [{
      id: Number,
      name: String,
      status: {
        type: String,
        enum: ['In Progress', 'Completed'],
        default: 'In Progress'
      }
    }]
  }
}, {
  timestamps: true
});

// Pre-save hook to set status based on endDate
internSchema.pre('save', function(next) {
  if (this.endDate && new Date(this.endDate) <= new Date()) {
    this.status = 'completed';
  } else {
    this.status = 'active';
  }
  next();
});

const Intern = mongoose.model('Intern', internSchema);

module.exports = Intern;
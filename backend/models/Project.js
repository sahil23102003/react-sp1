const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  requiredPeople: {
    type: Number,
    default: 1,
    min: 1
  },
  techStacks: [{
    type: String,
    trim: true
  }],
  assignedInterns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Intern'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Pre-save hook to calculate status based on dates
projectSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.startDate > now) {
    this.status = 'upcoming';
  } else if (this.endDate && this.endDate < now) {
    this.status = 'completed';
  } else {
    this.status = 'active';
  }
  
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
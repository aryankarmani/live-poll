const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return options && options.length >= 2;
      },
      message: 'Poll must have at least 2 options'
    }
  },
  responses: {
    type: [responseSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for efficient querying
pollSchema.index({ createdAt: -1 });
pollSchema.index({ isActive: 1 });

module.exports = mongoose.model('Poll', pollSchema); 
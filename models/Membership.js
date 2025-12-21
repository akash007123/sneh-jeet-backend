const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  interest: {
    type: String,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Pending', 'Talk', 'Approved'],
    default: 'New',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Membership', membershipSchema);
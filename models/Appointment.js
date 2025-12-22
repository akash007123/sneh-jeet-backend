const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
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
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'New',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
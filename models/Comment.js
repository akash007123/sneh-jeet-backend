const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  name: {
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
  profileImage: {
    type: String,
    trim: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
commentSchema.index({ blogId: 1, createdAt: -1 });
commentSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Comment', commentSchema);
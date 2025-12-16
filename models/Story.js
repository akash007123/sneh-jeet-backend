const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
storySchema.index({ isFeatured: -1, publishedDate: -1 });
storySchema.index({ category: 1, publishedDate: -1 });

module.exports = mongoose.model('Story', storySchema);
const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'planned'],
    default: 'open',
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate slug from title with uniqueness
ideaSchema.pre('save', async function(next) {
  if (this.isModified('title') || this.isNew) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    let slug = baseSlug;
    let counter = 1;

    // Check for uniqueness
    while (await mongoose.models.Idea.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

// Index for better query performance
ideaSchema.index({ status: 1, published: -1, createdAt: -1 });
ideaSchema.index({ category: 1, published: -1 });
ideaSchema.index({ published: -1, createdAt: -1 });

module.exports = mongoose.model('Idea', ideaSchema);
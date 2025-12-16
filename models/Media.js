const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: String,
    required: true,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate slug from title with uniqueness
mediaSchema.pre('save', async function(next) {
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
    while (await mongoose.models.Media.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

// Index for better query performance
mediaSchema.index({ featured: -1, published: -1, createdAt: -1 });
mediaSchema.index({ type: 1, published: -1 });
mediaSchema.index({ published: -1, createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
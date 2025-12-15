const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    required: true,
    trim: true,
  },
  sectionContent: {
    type: String,
    required: true,
    trim: true,
  },
  sectionImage: {
    type: String,
    trim: true,
  },
});

const blogSchema = new mongoose.Schema({
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
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  featuredImage: {
    type: String,
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  readTime: {
    type: String,
    required: true,
    trim: true,
  },
  sections: [sectionSchema],
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
  authorBio: {
    type: String,
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
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  seoKeywords: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate slug from title with uniqueness
blogSchema.pre('save', async function(next) {
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
    while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

// Index for better query performance
blogSchema.index({ isFeatured: -1, publishedDate: -1 });
blogSchema.index({ category: 1, publishedDate: -1 });
blogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', blogSchema);
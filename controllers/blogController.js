const Blog = require('../models/Blog');

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      isFeatured,
      tags,
      readTime,
      sections,
      authorName,
      authorBio,
      publishedDate,
      category,
      metaTitle,
      metaDescription,
      seoKeywords,
    } = req.body;

    // Basic validation
    if (!title || !excerpt || !content || !readTime || !authorName || !category) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Handle file uploads
    const featuredImage = req.files?.featuredImage ? `/uploads/blogs/${req.files.featuredImage[0].filename}` : null;

    // Process sections with images
    let processedSections = [];
    if (sections) {
      const sectionsArray = typeof sections === 'string' ? JSON.parse(sections) : sections;
      let fileIndex = 0;
      processedSections = sectionsArray.map((section) => {
        // Ensure sectionImage is string or null
        if (typeof section.sectionImage !== 'string') {
          section.sectionImage = null;
        }
        if (section.sectionImage === null && req.files?.sectionImages && req.files.sectionImages[fileIndex]) {
          section.sectionImage = `/uploads/blogs/${req.files.sectionImages[fileIndex].filename}`;
          fileIndex++;
        }
        return section;
      });
    }

    // Create blog
    const blog = new Blog({
      title,
      excerpt,
      content,
      featuredImage,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      readTime,
      sections: processedSections,
      authorName,
      authorBio,
      publishedDate: publishedDate || new Date(),
      category,
      metaTitle,
      metaDescription,
      seoKeywords,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Blog slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all blog posts with optional filtering
const getAllBlogs = async (req, res) => {
  try {
    const { category, featured, limit, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const limitNum = limit ? parseInt(limit) : 0;
    const skip = limitNum ? (parseInt(page) - 1) * limitNum : 0;

    const blogs = await Blog.find(query)
      .sort({ isFeatured: -1, publishedDate: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      blogs,
      total,
      page: parseInt(page),
      pages: limitNum ? Math.ceil(total / limitNum) : 1,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Basic validation
    if (updateData.title !== undefined && !updateData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (updateData.excerpt !== undefined && !updateData.excerpt) {
      return res.status(400).json({ error: 'Excerpt is required' });
    }
    if (updateData.content !== undefined && !updateData.content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (updateData.readTime !== undefined && !updateData.readTime) {
      return res.status(400).json({ error: 'Read time is required' });
    }
    if (updateData.authorName !== undefined && !updateData.authorName) {
      return res.status(400).json({ error: 'Author name is required' });
    }
    if (updateData.category !== undefined && !updateData.category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Handle file uploads
    if (req.files?.featuredImage) {
      updateData.featuredImage = `/uploads/blogs/${req.files.featuredImage[0].filename}`;
    } else if (req.body.removeFeaturedImage === 'true') {
      updateData.featuredImage = null; // Remove featured image
    }

    // Handle tags array
    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    // Handle isFeatured boolean
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    // Process sections with images
    if (updateData.sections) {
      const sectionsArray = typeof updateData.sections === 'string' ? JSON.parse(updateData.sections) : updateData.sections;
      let fileIndex = 0;
      updateData.sections = sectionsArray
        .filter(section => section.sectionTitle && section.sectionContent) // Filter out invalid sections
        .map((section) => {
          // Ensure sectionImage is string or null
          if (typeof section.sectionImage !== 'string') {
            section.sectionImage = null;
          }
          if (section.sectionImage === null && req.files?.sectionImages && req.files.sectionImages[fileIndex]) {
            section.sectionImage = `/uploads/blogs/${req.files.sectionImages[fileIndex].filename}`;
            fileIndex++;
          } else if (section.sectionImage === '') {
            section.sectionImage = null; // Remove image if empty string
          }
          return section;
        });
    }

    // Update slug if title changed
    if (updateData.title) {
      let baseSlug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-|-$/g, '');

      let slug = baseSlug;
      let counter = 1;

      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      updateData.slug = slug;
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Blog slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog categories
const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getBlogCategories,
};
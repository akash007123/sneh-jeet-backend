const Media = require('../models/Media');

// Create a new media item
const createMedia = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      duration,
      creator,
      featured,
      published,
      category,
    } = req.body;

    // Basic validation
    if (!title || !description || !type || !duration || !creator) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Handle file uploads
    const videoUrl = req.files?.videoFile ? `/uploads/media/${req.files.videoFile[0].filename}` : null;
    const thumbnailUrl = req.files?.thumbnailFile ? `/uploads/media/${req.files.thumbnailFile[0].filename}` : null;

    // Create media
    const media = new Media({
      title,
      description,
      type,
      duration,
      creator,
      featured: featured === 'true' || featured === true,
      published: published === 'true' || published === true,
      category,
      videoUrl,
      thumbnailUrl,
    });

    await media.save();
    res.status(201).json(media);
  } catch (error) {
    console.error('Error creating media:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Media slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all media items with optional filtering
const getAllMedia = async (req, res) => {
  try {
    const { type, featured, published, limit, page = 1 } = req.query;
    const query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (published !== undefined) {
      query.published = published === 'true';
    }

    const limitNum = limit ? parseInt(limit) : 0;
    const skip = limitNum ? (parseInt(page) - 1) * limitNum : 0;

    const media = await Media.find(query)
      .sort({ featured: -1, published: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Media.countDocuments(query);

    res.status(200).json({
      media,
      total,
      page: parseInt(page),
      pages: limitNum ? Math.ceil(total / limitNum) : 1,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get media by ID
const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get media by slug
const getMediaBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const media = await Media.findOne({ slug });
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update media
const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle file uploads
    if (req.files?.videoFile) {
      updateData.videoUrl = `/uploads/media/${req.files.videoFile[0].filename}`;
    }
    if (req.files?.thumbnailFile) {
      updateData.thumbnailUrl = `/uploads/media/${req.files.thumbnailFile[0].filename}`;
    }

    // Handle boolean fields
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }
    if (updateData.published !== undefined) {
      updateData.published = updateData.published === 'true' || updateData.published === true;
    }

    const media = await Media.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.status(200).json(media);
  } catch (error) {
    console.error('Error updating media:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Media slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByIdAndDelete(id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get media types
const getMediaTypes = async (req, res) => {
  try {
    const types = await Media.distinct('type');
    res.status(200).json(types);
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createMedia,
  getAllMedia,
  getMediaById,
  getMediaBySlug,
  updateMedia,
  deleteMedia,
  getMediaTypes,
};
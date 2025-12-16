const Story = require('../models/Story');

// Create a new story
const createStory = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      isFeatured,
      readTime,
      author,
      publishedDate,
      category,
      type,
    } = req.body;

    // Basic validation
    if (!title || !excerpt || !readTime || !author || !category) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Handle file upload
    const image = req.files?.image ? `/uploads/stories/${req.files.image[0].filename}` : null;

    // Create story
    const story = new Story({
      title,
      excerpt,
      content,
      image,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      readTime,
      author,
      publishedDate: publishedDate || new Date(),
      category,
      type,
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all stories with optional filtering
const getAllStories = async (req, res) => {
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

    const stories = await Story.find(query)
      .sort({ isFeatured: -1, publishedDate: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Story.countDocuments(query);

    res.status(200).json({
      stories,
      total,
      page: parseInt(page),
      pages: limitNum ? Math.ceil(total / limitNum) : 1,
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get story by ID
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update story
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle file upload
    if (req.files?.image) {
      updateData.image = `/uploads/stories/${req.files.image[0].filename}`;
    }

    // Handle isFeatured boolean
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    const story = await Story.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.status(200).json(story);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get story categories
const getStoryCategories = async (req, res) => {
  try {
    const categories = await Story.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getStoryCategories,
};
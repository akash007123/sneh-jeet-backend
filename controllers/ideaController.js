const Idea = require('../models/Idea');

// Create a new idea
const createIdea = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      status,
      author,
      likes,
      published,
    } = req.body;

    // Basic validation
    if (!title || !description || !category || !author) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Create idea
    const idea = new Idea({
      title,
      description,
      category,
      status: status || 'open',
      author,
      likes: likes ? parseInt(likes) : 0,
      published: published === 'true' || published === true,
    });

    await idea.save();
    res.status(201).json(idea);
  } catch (error) {
    console.error('Error creating idea:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Idea slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all ideas with optional filtering
const getAllIdeas = async (req, res) => {
  try {
    const { category, status, published, limit, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (published !== undefined) {
      query.published = published === 'true';
    }

    const limitNum = limit ? parseInt(limit) : 0;
    const skip = limitNum ? (parseInt(page) - 1) * limitNum : 0;

    const ideas = await Idea.find(query)
      .sort({ status: 1, published: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Idea.countDocuments(query);

    res.status(200).json({
      ideas,
      total,
      page: parseInt(page),
      pages: limitNum ? Math.ceil(total / limitNum) : 1,
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get idea by ID
const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.status(200).json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get idea by slug
const getIdeaBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const idea = await Idea.findOne({ slug });
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.status(200).json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update idea
const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle likes number
    if (updateData.likes !== undefined) {
      updateData.likes = parseInt(updateData.likes);
    }

    // Handle published boolean
    if (updateData.published !== undefined) {
      updateData.published = updateData.published === 'true' || updateData.published === true;
    }

    const idea = await Idea.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.status(200).json(idea);
  } catch (error) {
    console.error('Error updating idea:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Idea slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete idea
const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.status(200).json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get idea categories
const getIdeaCategories = async (req, res) => {
  try {
    const categories = await Idea.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Like an idea
const likeIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.status(200).json(idea);
  } catch (error) {
    console.error('Error liking idea:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  getIdeaBySlug,
  updateIdea,
  deleteIdea,
  getIdeaCategories,
  likeIdea,
};
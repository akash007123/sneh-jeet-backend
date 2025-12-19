const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { blogId, name, email, comment } = req.body;

    // Basic validation
    if (!blogId || !name || !email || !comment) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Handle profile image upload
    const profileImage = req.file ? `/uploads/comments/${req.file.filename}` : null;

    // Create comment
    const newComment = new Comment({
      blogId,
      name,
      email,
      profileImage,
      comment,
      isApproved: true, // For testing - comments show immediately
    });

    await newComment.save();
    res.status(201).json({
      message: 'Comment submitted successfully. It will be reviewed and published soon.',
      comment: newComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all approved comments for a specific blog
const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    const comments = await Comment.find({ blogId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .populate('blogId', 'title slug');

    const total = await Comment.countDocuments({ blogId, isApproved: true });

    res.status(200).json({
      comments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get comment count for a specific blog
const getCommentCount = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const count = await Comment.countDocuments({ blogId, isApproved: true });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching comment count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all comments (for admin)
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 10, approved } = req.query;

    const query = {};
    if (approved !== undefined) {
      query.isApproved = approved === 'true';
    }

    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .populate('blogId', 'title slug');

    const total = await Comment.countDocuments(query);

    res.status(200).json({
      comments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Approve or reject comment
const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error updating comment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, comment: commentText, profileImage } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (commentText) updateData.comment = commentText;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `/uploads/comments/${req.file.filename}`;
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComment,
  getCommentsByBlog,
  getCommentCount,
  getAllComments,
  updateCommentStatus,
  updateComment,
  deleteComment,
};
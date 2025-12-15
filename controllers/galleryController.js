const Gallery = require('../models/Gallery');

const createGalleryItem = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const imageUrl = req.file ? `/uploads/gallery/${req.file.filename}` : null;

    // Basic validation
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    // Create gallery item
    const galleryItem = new Gallery({
      title,
      category,
      description,
      imageUrl,
    });
    await galleryItem.save();

    res.status(201).json(galleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.status(200).json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;
    const updateData = { title, category, description };

    if (req.file) {
      updateData.imageUrl = `/uploads/gallery/${req.file.filename}`;
    }

    const galleryItem = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.status(200).json(galleryItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findByIdAndDelete(id);
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGalleryCategories = async (req, res) => {
  try {
    const categories = await Gallery.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryCategories,
};
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getStoryCategories,
} = require('../controllers/storyController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/stories'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), createStory);
router.get('/', getAllStories);
router.get('/categories', getStoryCategories);
router.get('/:id', getStoryById);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), updateStory);
router.delete('/:id', deleteStory);

module.exports = router;
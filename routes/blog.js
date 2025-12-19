const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getBlogCategories,
} = require('../controllers/blogController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/blogs'));
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
router.post('/', auth, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'sectionImages', maxCount: 10 }
]), createBlog);
router.get('/', getAllBlogs);
router.get('/categories', getBlogCategories);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);
router.put('/:id', auth, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'sectionImages', maxCount: 10 }
]), updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;
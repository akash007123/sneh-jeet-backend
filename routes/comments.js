const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');
const {
  createComment,
  getCommentsByBlog,
  getCommentCount,
  getAllComments,
  updateCommentStatus,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/comments'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for profile images
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

// Public routes
router.post('/', upload.single('profileImage'), createComment);
router.get('/blog/:blogId', getCommentsByBlog);
router.get('/blog/:blogId/count', getCommentCount);

// Admin routes (these would typically be protected with authentication middleware)
router.get('/', auth, adminAuth, getAllComments);
router.put('/:id/status', auth, adminAuth, updateCommentStatus);
router.put('/:id', auth, adminAuth, upload.single('profileImage'), updateComment);
router.delete('/:id', auth, adminAuth, deleteComment);

module.exports = router;
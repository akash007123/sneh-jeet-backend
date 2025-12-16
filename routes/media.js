const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createMedia,
  getAllMedia,
  getMediaById,
  getMediaBySlug,
  updateMedia,
  deleteMedia,
  getMediaTypes,
} = require('../controllers/mediaController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/media'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'videoFile') {
      const allowedTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only video files are allowed for video upload!'));
      }
    } else if (file.fieldname === 'thumbnailFile') {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for thumbnail!'));
      }
    }
  }
});

// Routes
router.post('/', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]), createMedia);
router.get('/', getAllMedia);
router.get('/types', getMediaTypes);
router.get('/slug/:slug', getMediaBySlug);
router.get('/:id', getMediaById);
router.put('/:id', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]), updateMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
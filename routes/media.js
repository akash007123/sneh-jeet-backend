const express = require('express');
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

// Routes
router.post('/', createMedia);
router.get('/', getAllMedia);
router.get('/types', getMediaTypes);
router.get('/slug/:slug', getMediaBySlug);
router.get('/:id', getMediaById);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
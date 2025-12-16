const express = require('express');
const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  getIdeaBySlug,
  updateIdea,
  deleteIdea,
  getIdeaCategories,
  likeIdea,
} = require('../controllers/ideaController');

const router = express.Router();

// Routes
router.post('/', createIdea);
router.get('/', getAllIdeas);
router.get('/categories', getIdeaCategories);
router.get('/slug/:slug', getIdeaBySlug);
router.get('/:id', getIdeaById);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);
router.patch('/:id/like', likeIdea);

module.exports = router;
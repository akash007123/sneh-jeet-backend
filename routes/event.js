const express = require('express');
const { createEvent, getAllEvents, getEventById, getEventBySlug, updateEvent, deleteEvent } = require('../controllers/eventController');

const router = express.Router();

router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/slug/:slug', getEventBySlug);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
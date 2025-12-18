const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// Public route for subscribing
router.post('/', subscriptionController.createSubscription);

// Admin routes (protected)
router.get('/', auth, subscriptionController.getSubscriptions);
router.put('/:id', auth, subscriptionController.updateSubscription);
router.delete('/:id', auth, subscriptionController.deleteSubscription);

module.exports = router;
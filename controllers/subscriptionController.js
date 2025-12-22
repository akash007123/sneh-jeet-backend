const Subscription = require('../models/Subscription');

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const subscription = new Subscription({ email });
    await subscription.save();

    res.status(201).json({ message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const subscriptions = await Subscription.find(query).sort({ subscribedAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update subscription status
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, category, description, image } = req.body;

    // Basic validation
    if (!title || !date || !time || !location || !category || !description) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Create event
    const event = new Event({
      title,
      date,
      time,
      location,
      category,
      description,
      image,
    });
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await Event.findOne({ slug });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, location, category, description, image } = req.body;
    const event = await Event.findByIdAndUpdate(
      id,
      { title, date, time, location, category, description, image },
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getEventBySlug,
  updateEvent,
  deleteEvent,
};
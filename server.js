require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const contactRoutes = require('./routes/contact');
const eventRoutes = require('./routes/event');
const galleryRoutes = require('./routes/gallery');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/gallery', galleryRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Sneh Jeet NGO Backend API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
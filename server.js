require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const contactRoutes = require('./routes/contact');
const appointmentRoutes = require('./routes/appointment');
const eventRoutes = require('./routes/event');
const galleryRoutes = require('./routes/gallery');
const blogRoutes = require('./routes/blog');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const ideaRoutes = require('./routes/ideas');
const membershipRoutes = require('./routes/membership');
const storyRoutes = require('./routes/story');
const subscriptionRoutes = require('./routes/subscription');
const userRoutes = require('./routes/user');

const app = express();

// Connect to database
connectDB();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const blogsDir = path.join(uploadsDir, 'blogs');
const commentsDir = path.join(uploadsDir, 'comments');
const galleryDir = path.join(uploadsDir, 'gallery');
const mediaDir = path.join(uploadsDir, 'media');
const profileDir = path.join(uploadsDir, 'profile');
const storiesDir = path.join(uploadsDir, 'stories');
const membershipDir = path.join(uploadsDir, 'membership');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(blogsDir)) fs.mkdirSync(blogsDir, { recursive: true });
if (!fs.existsSync(commentsDir)) fs.mkdirSync(commentsDir, { recursive: true });
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });
if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });
if (!fs.existsSync(membershipDir)) fs.mkdirSync(membershipDir, { recursive: true });

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Sneh Jeet NGO Backend API');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
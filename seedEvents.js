require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const connectDB = require('./config/database');

// Function to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

const events = [
  {
    title: "Pride Month Celebration",
    date: new Date("2025-06-15"),
    time: "2:00 PM - 8:00 PM",
    location: "Central Park",
    category: "celebration",
    description: "Join us for our annual Pride celebration featuring live music, speakers, and community activities.",
    image: "pride",
    slug: createSlug("Pride Month Celebration"),
  },
  {
    title: "Trans Awareness Workshop",
    date: new Date("2025-01-20"),
    time: "6:00 PM - 8:00 PM",
    location: "Community Center",
    category: "workshop",
    description: "An educational workshop on transgender issues, allyship, and creating inclusive spaces.",
    image: "workshop",
    slug: createSlug("Trans Awareness Workshop"),
  },
  {
    title: "Mental Health Support Group",
    date: new Date("2025-01-25"),
    time: "7:00 PM - 9:00 PM",
    location: "Online (Zoom)",
    category: "support",
    description: "Weekly peer support group for LGBTQIA+ individuals dealing with anxiety, depression, or other mental health challenges.",
    image: "support",
    slug: createSlug("Mental Health Support Group"),
  },
  {
    title: "Youth Mixer Night",
    date: new Date("2025-02-01"),
    time: "5:00 PM - 8:00 PM",
    location: "Youth Center",
    category: "social",
    description: "A safe social event for LGBTQIA+ youth ages 14-21 to connect and make friends.",
    image: "youth",
    slug: createSlug("Youth Mixer Night"),
  },
  {
    title: "Legal Rights Seminar",
    date: new Date("2025-02-10"),
    time: "1:00 PM - 4:00 PM",
    location: "Downtown Library",
    category: "workshop",
    description: "Learn about your legal rights, name/gender marker changes, and anti-discrimination protections.",
    image: "legal",
    slug: createSlug("Legal Rights Seminar"),
  },
];

const seedEvents = async () => {
  try {
    await connectDB();
    await Event.deleteMany(); // Clear existing events
    await Event.insertMany(events);
    console.log('Events seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
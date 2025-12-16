require('dotenv').config();
const mongoose = require('mongoose');
const Story = require('./models/Story');
const connectDB = require('./config/database');

const stories = [
  {
    title: "Finding My Voice: A Coming Out Story",
    excerpt: "After years of hiding, I finally found the courage to live authentically. This is my journey.",
    author: "Anonymous",
    publishedDate: new Date("2025-01-10"),
    category: "personal",
    readTime: "5 min read",
    isFeatured: true,
    type: "Personal Journey",
  },
  {
    title: "Building Community: 10 Years of Pride Events",
    excerpt: "A look back at a decade of Pride celebrations and how our community has grown stronger together.",
    author: "Community Team",
    publishedDate: new Date("2025-01-05"),
    category: "community",
    readTime: "8 min read",
    isFeatured: true,
    type: "Community Impact",
  },
  {
    title: "Navigating Healthcare as a Trans Person",
    excerpt: "Tips and resources for finding affirming healthcare providers and accessing necessary care.",
    author: "Dr. Kim Lee",
    publishedDate: new Date("2024-12-28"),
    category: "resources",
    readTime: "6 min read",
    isFeatured: false,
    type: "Health Guide",
  },
  {
    title: "My Journey to Self-Acceptance",
    excerpt: "The path to self-love isn't always linear, but it's always worth walking.",
    author: "Jordan M.",
    publishedDate: new Date("2024-12-20"),
    category: "personal",
    readTime: "4 min read",
    isFeatured: false,
    type: "Personal Journey",
  },
  {
    title: "Allyship in Action: A Parent's Perspective",
    excerpt: "How learning to support my child taught me about unconditional love and acceptance.",
    author: "Parent Ally",
    publishedDate: new Date("2024-12-15"),
    category: "allies",
    readTime: "7 min read",
    isFeatured: false,
    type: "Ally Story",
  },
];

const seedStories = async () => {
  try {
    await connectDB();
    await Story.deleteMany(); // Clear existing stories
    await Story.insertMany(stories);
    console.log('Stories seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding stories:', error);
    process.exit(1);
  }
};

seedStories();
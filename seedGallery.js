const mongoose = require('mongoose');
const Gallery = require('./models/Gallery');
require('dotenv').config();

const galleryData = [
  { title: "Pride Parade 2024", category: "pride", description: "Community members celebrating at the annual pride parade" },
  { title: "Youth Support Group", category: "community", description: "Weekly youth support group meeting" },
  { title: "Trans Day of Visibility", category: "pride", description: "Celebrating transgender community members" },
  { title: "Community Workshop", category: "events", description: "Mental health workshop for the community" },
  { title: "Volunteer Team", category: "community", description: "Our dedicated volunteer team in action" },
  { title: "Pride Festival", category: "pride", description: "Annual pride festival with music and celebrations" },
  { title: "Support Group Meeting", category: "community", description: "Monthly support group gathering" },
  { title: "Health Fair", category: "events", description: "Community health fair with free screenings" },
  { title: "Youth Art Show", category: "events", description: "Youth art exhibition showcasing LGBTQIA+ themes" },
];

const seedGallery = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sneh-jeet-ngo');

    // Clear existing data
    await Gallery.deleteMany({});

    // Insert new data
    await Gallery.insertMany(galleryData);

    console.log('Gallery data seeded successfully!');
  } catch (error) {
    console.error('Error seeding gallery data:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedGallery();
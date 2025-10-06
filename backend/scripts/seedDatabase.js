// Demo user seeding script
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedDemoUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Check if demo user already exists
    const existingDemoUser = await User.findOne({ email: 'demo@travelsensei.com' });
    
    if (!existingDemoUser) {
      // Create demo user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo123', salt);

      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@travelsensei.com',
        password: hashedPassword,
        role: 'user',
        preferences: {
          interests: ['culture', 'food', 'nature'],
          budget: {
            min: 100,
            max: 1000
          },
          notifications: true,
          accessibility: false,
          travelStyle: 'balanced'
        },
        location: {
          city: 'New York',
          country: 'USA'
        }
      });

      await demoUser.save();
      console.log('✅ Demo user created successfully!');
      console.log('📧 Email: demo@travelsensei.com');
      console.log('🔑 Password: demo123');
    } else {
      console.log('ℹ️ Demo user already exists');
    }

    // Create test user
    const existingTestUser = await User.findOne({ email: 'test@example.com' });
    
    if (!existingTestUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
        preferences: {
          interests: ['adventure', 'culture'],
          budget: {
            min: 200,
            max: 800
          },
          notifications: true,
          travelStyle: 'adventure'
        }
      });

      await testUser.save();
      console.log('✅ Test user created successfully!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: password123');
    } else {
      console.log('ℹ️ Test user already exists');
    }

    await mongoose.connection.close();
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDemoUsers();
}

module.exports = seedDemoUsers;
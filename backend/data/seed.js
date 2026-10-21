const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const User = require('../models/User');
const { seedRooms, seedBookings, seedGuests, seedUsers } = require('./seedData');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_management');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Room.deleteMany();
    await Booking.deleteMany();
    await Guest.deleteMany();
    await User.deleteMany();

    // Insert seeds
    await Room.insertMany(seedRooms);
    await Booking.insertMany(seedBookings);
    await Guest.insertMany(seedGuests);
    await User.insertMany(seedUsers);

    console.log('✅ Hotel database seeded successfully with Rooms, Bookings, Guests, and Users!');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

importData();

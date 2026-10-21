const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_management', {
      serverSelectionTimeoutMS: 2500 // Don't hang if MongoDB is not running locally
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`⚠️  Notice: MongoDB not running locally (${error.message}).`);
    console.log(`💡 The backend will automatically use its built-in in-memory / JSON store fallback.`);
    console.log(`🚀 All CRUD operations, reservations, and room updates will work smoothly!`);
    return false;
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };

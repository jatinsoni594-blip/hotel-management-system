const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Room type name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Penthouse'],
      default: 'Standard'
    },
    floor: {
      type: Number,
      required: true,
      default: 1
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: 0
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 2
    },
    bedType: {
      type: String,
      default: 'King Bed'
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
      default: 'Available'
    },
    amenities: {
      type: [String],
      default: ['Free High-Speed Wi-Fi', 'Air Conditioning']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Room', roomSchema);

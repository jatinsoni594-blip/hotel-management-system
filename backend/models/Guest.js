const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    idProof: {
      type: String,
      default: ''
    },
    membership: {
      type: String,
      enum: ['Standard', 'Silver Member', 'Gold Member', 'Platinum VIP', 'Diamond Elite'],
      default: 'Standard'
    },
    totalStays: {
      type: Number,
      default: 1
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Guest', guestSchema);

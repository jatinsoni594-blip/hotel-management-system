const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    guest: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true },
      idProof: { type: String, default: 'Passport / ID' }
    },
    roomNumber: {
      type: String,
      required: true
    },
    roomType: {
      type: String,
      required: true
    },
    checkInDate: {
      type: String,
      required: true
    },
    checkOutDate: {
      type: String,
      required: true
    },
    numberOfGuests: {
      type: Number,
      required: true,
      default: 1
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Paid'
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Pay at Hotel'],
      default: 'Credit Card'
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'],
      default: 'Confirmed'
    },
    specialRequests: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

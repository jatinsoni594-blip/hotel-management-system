const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBookingById);

router.route('/:bookingId/status')
  .patch(updateBookingStatus);

module.exports = router;

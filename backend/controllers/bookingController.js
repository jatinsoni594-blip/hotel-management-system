const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { getStatus } = require('../config/db');
const { seedBookings, seedRooms } = require('../data/seedData');

let localBookings = [...seedBookings];
let localRoomsRef = [...seedRooms];

// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (getStatus()) {
      let query = {};
      if (status && status !== 'All') query.bookingStatus = status;
      if (search) {
        query.$or = [
          { bookingId: { $regex: search, $options: 'i' } },
          { 'guest.name': { $regex: search, $options: 'i' } },
          { 'guest.email': { $regex: search, $options: 'i' } },
          { roomNumber: { $regex: search, $options: 'i' } }
        ];
      }
      const bookings = await Booking.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: bookings.length, data: bookings });
    }

    let filtered = [...localBookings];
    if (status && status !== 'All') {
      filtered = filtered.filter(b => b.bookingStatus.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b => 
        b.bookingId.toLowerCase().includes(q) ||
        b.guest.name.toLowerCase().includes(q) ||
        b.guest.email.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID or search by email
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getStatus()) {
      const booking = await Booking.findOne({
        $or: [{ bookingId: id.toUpperCase() }, { 'guest.email': id.toLowerCase() }]
      });
      if (!booking) return res.status(404).json({ success: false, message: 'Reservation not found' });
      return res.json({ success: true, data: booking });
    }

    const booking = localBookings.find(
      b => b.bookingId.toUpperCase() === id.toUpperCase() || b.guest.email.toLowerCase() === id.toLowerCase()
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Reservation not found' });
    return res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new booking (Guest or Receptionist)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      guest,
      roomNumber,
      roomType,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      paymentMethod,
      specialRequests
    } = req.body;

    if (!guest || !guest.name || !guest.email || !guest.phone || !roomNumber || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BK-2026-${randomSuffix}`;

    const newBookingData = {
      bookingId,
      guest: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        idProof: guest.idProof || 'Passport / ID'
      },
      roomNumber,
      roomType: roomType || 'Standard Room',
      checkInDate,
      checkOutDate,
      numberOfGuests: Number(numberOfGuests) || 1,
      totalPrice: Number(totalPrice) || 200,
      paymentStatus: paymentMethod === 'Pay at Hotel' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod || 'Credit Card',
      bookingStatus: 'Confirmed',
      specialRequests: specialRequests || '',
      createdAt: new Date().toISOString()
    };

    if (getStatus()) {
      const booking = await Booking.create(newBookingData);
      return res.status(201).json({ success: true, data: booking });
    }

    localBookings.unshift(newBookingData);
    return res.status(201).json({ success: true, data: newBookingData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Check-In, Check-Out, Cancel)
// @route   PATCH /api/bookings/:bookingId/status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    let targetBooking = null;

    if (getStatus()) {
      targetBooking = await Booking.findOneAndUpdate(
        { bookingId: bookingId.toUpperCase() },
        { bookingStatus: status },
        { new: true }
      );
      if (!targetBooking) return res.status(404).json({ success: false, message: 'Booking not found' });

      // Automatically update room status based on booking status
      if (status === 'Checked-In') {
        await Room.findOneAndUpdate({ roomNumber: targetBooking.roomNumber }, { status: 'Occupied' });
      } else if (status === 'Checked-Out') {
        await Room.findOneAndUpdate({ roomNumber: targetBooking.roomNumber }, { status: 'Cleaning' });
      } else if (status === 'Cancelled') {
        await Room.findOneAndUpdate({ roomNumber: targetBooking.roomNumber }, { status: 'Available' });
      }

      return res.json({ success: true, data: targetBooking });
    }

    const booking = localBookings.find(b => b.bookingId.toUpperCase() === bookingId.toUpperCase());
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.bookingStatus = status;

    return res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics & analytics
// @route   GET /api/stats
const getStats = async (req, res) => {
  try {
    let totalRooms = 8;
    let occupiedRooms = 2;
    let availableRooms = 4;
    let cleaningRooms = 1;
    let maintenanceRooms = 1;
    let totalBookings = localBookings.length;
    let totalRevenue = localBookings
      .filter(b => b.bookingStatus !== 'Cancelled')
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    if (getStatus()) {
      const rooms = await Room.find();
      totalRooms = rooms.length;
      occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
      availableRooms = rooms.filter(r => r.status === 'Available').length;
      cleaningRooms = rooms.filter(r => r.status === 'Cleaning').length;
      maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;

      const bookings = await Booking.find();
      totalBookings = bookings.length;
      totalRevenue = bookings
        .filter(b => b.bookingStatus !== 'Cancelled')
        .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    }

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return res.json({
      success: true,
      data: {
        totalRooms,
        occupiedRooms,
        availableRooms,
        cleaningRooms,
        maintenanceRooms,
        occupancyRate,
        totalBookings,
        totalRevenue,
        todayCheckIns: 2,
        todayCheckOuts: 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  getStats
};

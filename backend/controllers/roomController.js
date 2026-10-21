const Room = require('../models/Room');
const { getStatus } = require('../config/db');
const { seedRooms } = require('../data/seedData');

// Fallback in-memory store if MongoDB is not connected
let localRooms = [...seedRooms];

// @desc    Get all rooms (supports filters)
// @route   GET /api/rooms
const getRooms = async (req, res) => {
  try {
    const { status, category, minPrice, maxPrice, capacity } = req.query;

    if (getStatus()) {
      let query = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (capacity) query.capacity = { $gte: Number(capacity) };
      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
      }
      const rooms = await Room.find(query).sort({ roomNumber: 1 });
      return res.json({ success: true, count: rooms.length, data: rooms });
    }

    // Fallback store
    let filtered = [...localRooms];
    if (status && status !== 'All') {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    if (capacity) {
      filtered = filtered.filter(r => r.capacity >= Number(capacity));
    }
    if (minPrice) {
      filtered = filtered.filter(r => r.pricePerNight >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(r => r.pricePerNight <= Number(maxPrice));
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room by number
// @route   GET /api/rooms/:roomNumber
const getRoomByNumber = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    if (getStatus()) {
      const room = await Room.findOne({ roomNumber });
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
      return res.json({ success: true, data: room });
    }

    const room = localRooms.find(r => r.roomNumber === roomNumber);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    return res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, category, floor, pricePerNight, capacity, bedType, amenities, image, description } = req.body;

    if (!roomNumber || !type || !pricePerNight) {
      return res.status(400).json({ success: false, message: 'Please provide roomNumber, type, and pricePerNight' });
    }

    if (getStatus()) {
      const exists = await Room.findOne({ roomNumber });
      if (exists) {
        return res.status(400).json({ success: false, message: `Room ${roomNumber} already exists` });
      }
      const room = await Room.create(req.body);
      return res.status(201).json({ success: true, data: room });
    }

    const exists = localRooms.find(r => r.roomNumber === roomNumber);
    if (exists) {
      return res.status(400).json({ success: false, message: `Room ${roomNumber} already exists` });
    }

    const newRoom = {
      roomNumber,
      type,
      category: category || 'Standard',
      floor: Number(floor) || 1,
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity) || 2,
      bedType: bedType || 'King Bed',
      status: 'Available',
      amenities: amenities || ['Free High-Speed Wi-Fi', 'Air Conditioning'],
      image: image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      description: description || 'Beautiful, clean guest room with modern amenities.'
    };

    localRooms.push(newRoom);
    return res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room details or status
// @route   PUT /api/rooms/:roomNumber
const updateRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    if (getStatus()) {
      const room = await Room.findOneAndUpdate({ roomNumber }, req.body, { new: true, runValidators: true });
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
      return res.json({ success: true, data: room });
    }

    const index = localRooms.findIndex(r => r.roomNumber === roomNumber);
    if (index === -1) return res.status(404).json({ success: false, message: 'Room not found' });

    localRooms[index] = { ...localRooms[index], ...req.body };
    return res.json({ success: true, data: localRooms[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room status (Available, Occupied, Cleaning, Maintenance)
// @route   PATCH /api/rooms/:roomNumber/status
const updateRoomStatus = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const { status } = req.body;

    const validStatuses = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid room status' });
    }

    if (getStatus()) {
      const room = await Room.findOneAndUpdate({ roomNumber }, { status }, { new: true });
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
      return res.json({ success: true, data: room });
    }

    const room = localRooms.find(r => r.roomNumber === roomNumber);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    room.status = status;
    return res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:roomNumber
const deleteRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    if (getStatus()) {
      const room = await Room.findOneAndDelete({ roomNumber });
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
      return res.json({ success: true, message: `Room ${roomNumber} deleted successfully` });
    }

    const index = localRooms.findIndex(r => r.roomNumber === roomNumber);
    if (index === -1) return res.status(404).json({ success: false, message: 'Room not found' });

    localRooms.splice(index, 1);
    return res.json({ success: true, message: `Room ${roomNumber} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomByNumber,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom
};

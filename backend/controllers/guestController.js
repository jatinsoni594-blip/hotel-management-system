const Guest = require('../models/Guest');
const { getStatus } = require('../config/db');
const { seedGuests } = require('../data/seedData');

let localGuests = [...seedGuests];

// @desc    Get all guests
// @route   GET /api/guests
const getGuests = async (req, res) => {
  try {
    const { search } = req.query;

    if (getStatus()) {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }
      const guests = await Guest.find(query).sort({ totalSpent: -1 });
      return res.json({ success: true, count: guests.length, data: guests });
    }

    let filtered = [...localGuests];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.phone.includes(q)
      );
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGuests };

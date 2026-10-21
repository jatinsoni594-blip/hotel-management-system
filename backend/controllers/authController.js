const User = require('../models/User');
const { getStatus } = require('../config/db');
const { seedUsers } = require('../data/seedData');

// @desc    Admin / Staff Login
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    if (getStatus()) {
      const user = await User.findOne({ username });
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      return res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: 'sample-mock-jwt-token-xyz'
      });
    }

    const user = seedUsers.find(u => u.username === username);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Hint: user: admin, pass: admin123password' });
    }

    return res.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: 'sample-mock-jwt-token-xyz'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login };

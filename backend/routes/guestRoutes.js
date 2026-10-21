const express = require('express');
const router = express.Router();
const { getGuests } = require('../controllers/guestController');

router.get('/', getGuests);

module.exports = router;

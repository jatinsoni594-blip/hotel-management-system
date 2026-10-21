const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomByNumber,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom
} = require('../controllers/roomController');

router.route('/')
  .get(getRooms)
  .post(createRoom);

router.route('/:roomNumber')
  .get(getRoomByNumber)
  .put(updateRoom)
  .delete(deleteRoom);

router.route('/:roomNumber/status')
  .patch(updateRoomStatus);

module.exports = router;

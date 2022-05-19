// ---------------   Models  ---------------
const Property = require('../models/property');

// ---------------   Module Imports  ---------------
const express = require('express');
const property = require('../controllers/property/property');
const room = require('../controllers/property/room');
const { isAuth } = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Room Details Routes  ----------
router.get('/add-room/:propId', isAuth, room.getAddRoom);
router.post('/add-room', isAuth, room.postAddRoom);
router.get('/edit-room/:propId', isAuth, room.getEditRoom);
router.post('/edit-room', isAuth, room.postEditRoom);

// ----------  Room Images Routes  ----------
router.get('/add-room-images/:propId', isAuth, room.getAddRoomImages);
router.post('/add-room-images/', isAuth, room.postAddRoomImages);
router.post('/delete-room-image', isAuth, room.delRoomImages);

module.exports = router;

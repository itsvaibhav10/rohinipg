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
router.get('/add-room', isAuth, property.getAddPropertyDetails);
router.post('/add-room', isAuth, property.postAddPropertyDetails);
router.get('/edit-property/:roomId', isAuth, property.getEditPropertyDetails);
router.post('/edit-property', isAuth, property.postEditPropertyDetails);

// ----------  Room Images Routes  ----------
router.get('/room-images/:roomId', isAuth, property.getPropertyImages);
router.get(
  '/add-room-images/:roomId',
  isAuth,
  property.getAddPropertyImagesCategory
);
router.post(
  '/add-room-images',
  isAuth,
  property.postAddPropertyImagesCategory
);
router.post('/delete-room-image', isAuth, property.deletePropertyImages);

// ----------  Manage Room Routes  ----------
router.get('/manage-room/:propId', isAuth, room.manageRoom);

// ----------  View Room Routes  ----------
router.get('/room/:propId', isAuth, property.viewProperty);


module.exports = router;

// ---------------   Models  ---------------
const Property = require('../models/property');

// ---------------   Module Imports  ---------------
const express = require('express');
const property = require('../controllers/property');

const { isAuth } = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Property Details Routes  ----------
router.get('/add-property', isAuth, property.getAddPropertyDetails);
router.post('/add-property', isAuth, property.postAddPropertyDetails);
router.get('/edit-property/:propId', isAuth, property.getEditPropertyDetails);
router.post('/edit-property', isAuth, property.postEditPropertyDetails);

// ----------  Property Images Routes  ----------
router.get('/property-images/:propId', isAuth, property.getPropertyImages);
router.get(
  '/add-property-images/:propId',
  isAuth,
  property.getAddPropertyImagesCategory
);
router.post('/add-property-images', isAuth, property.postAddPropertyImagesCategory);
router.get('/delete-property-image/:propId', isAuth,property.deletePropertyImages);

// ----------  Delete Property Routes  ----------
router.post('/delete-property', isAuth, property.deleteProperty);

// ----------  Manage Property Routes  ----------
router.get('/manage-properties', isAuth, property.getProperties);
router.get('/manage-property/:propId', isAuth, property.manageProperty);

// ----------  View Property Routes  ----------
router.get('/property/:propId', isAuth, property.viewProperty);

module.exports = router;

// ---------------   Module Imports  ---------------
const express = require('express');
const property = require('../controllers/property/property');
const { isAuth } = require('../middleware/is-auth');
const { body } = require('express-validator');

// Initializing Router
const router = express.Router();

// ----------  Add Property Details Routes  ----------
router.get('/add-property', isAuth, property.getAddPropertyDetails);
router.post(
  '/add-property',
  isAuth,
  [
    body('title', 'Title Cant be Empty').trim().notEmpty().toLowerCase(),
    body('description', 'Description Cant be Empty')
      .trim()
      .notEmpty()
      .toLowerCase(),
    body('houseNo', 'House No Cant be Empty').trim().notEmpty().toLowerCase(),
    body('street', 'Street Cant be Empty').trim().notEmpty().toLowerCase(),
    body('city', 'City Cant be Empty').trim().notEmpty().toLowerCase(),
    body('pincode', 'Pincode Cant be Empty').trim().notEmpty(),
  ],
  property.postAddPropertyDetails
);

// ----------  Edit Property Details Routes  ----------
router.get('/edit-property/:propId', isAuth, property.getEditPropertyDetails);
router.post(
  '/edit-property',
  isAuth,
  [
    body('title', 'Title Cant be Empty').trim().notEmpty().toLowerCase(),
    body('description', 'Description Cant be Empty')
      .trim()
      .notEmpty()
      .toLowerCase(),
    body('houseNo', 'House No Cant be Empty').trim().notEmpty().toLowerCase(),
    body('street', 'Street Cant be Empty').trim().notEmpty().toLowerCase(),
    body('city', 'City Cant be Empty').trim().notEmpty().toLowerCase(),
    body('pincode', 'Pincode Cant be Empty').trim().notEmpty(),
  ],
  property.postEditPropertyDetails
);

// ----------  Property Images Routes  ----------
router.get('/property-images/:propId', isAuth, property.getPropertyImages);
router.get(
  '/add-property-images/:propId',
  isAuth,
  property.getAddPropertyImagesCategory
);
router.post(
  '/add-property-images',
  isAuth,
  property.postAddPropertyImagesCategory
);
router.post('/delete-property-image', isAuth, property.deletePropertyImages);

// ----------  Manage Property Routes  ----------
router.get('/manage-properties', isAuth, property.getProperties);
router.get('/manage-property/:propId', isAuth, property.manageProperty);

// ----------  View Property Routes  ----------
router.get('/property/:propId', isAuth, property.viewProperty);

module.exports = router;

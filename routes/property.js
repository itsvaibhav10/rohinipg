// ---------------   Models  ---------------
const Property = require('../models/property');

// ---------------   Module Imports  ---------------
const express = require('express');
const {
  getAddProperty,
  postAddProperty,
  getEditProperty,
  viewProperty,
  manageProperty,
  deleteProperty,
  postEditProperty
} = require('../controllers/property');

const { isAuth } = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Add Property Routes  ----------
router.get('/add-property', isAuth, getAddProperty);
router.post('/add-property', isAuth, postAddProperty);

// ----------  Edit Property Routes  ----------
router.get('/edit-property/:propId', isAuth, getEditProperty);
router.post('/edit-property', isAuth, postEditProperty);

// ----------  Delete Property Routes  ----------
router.post('/delete-property', isAuth, deleteProperty);

// ----------  Manage Property Routes  ----------
router.get('/manage-property', isAuth, manageProperty);

// ----------  View Property Routes  ----------
router.get('/property/:propId', isAuth, viewProperty);

module.exports = router;

// ---------------   Models  ---------------
const Property = require('../models/property');

// ---------------   Module Imports  ---------------
const express = require('express');
const { getAddProperty } = require('../controllers/admin/property');

// Initializing Router
const router = express.Router();

router.get('/add-property', getAddProperty);

module.exports = router;

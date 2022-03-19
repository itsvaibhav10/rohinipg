// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const { home, index } = require('../controllers/home');
// Initializing Router
const router = express.Router();

router.get('/', index);
router.get('/home', home);

module.exports = router;

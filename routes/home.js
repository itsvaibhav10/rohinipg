// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const home = require('../controllers/home');
const { isAuth } = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

router.get('/', home.index);
router.get('/home', home.home);
router.get('/search', home.getProperties);
router.post('/enquiry', isAuth, home.enquiry);
router.post('/search', home.postProperties);

module.exports = router;

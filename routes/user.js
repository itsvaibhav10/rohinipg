// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const user = require('../controllers/user');
const { isAuth } = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

router.get('/user-profile', isAuth, user.profile);

module.exports = router;

// ---------------   Module Imports  ---------------
const express = require('express');
const home = require('../controllers/home');

const { isAuth } = require('../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Home Routes  ----------
router.get('/', home.index);
router.get('/home', home.home);

// ----------  Search Routes  ----------
router.get('/search', home.getProperties);
router.post('/search', home.postProperties);

// ----------  Enquiry Routes  ----------
router.post('/enquiry', isAuth, home.enquiry);



module.exports = router;

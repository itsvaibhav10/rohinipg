// ---------------   Module Imports  ---------------
const express = require('express');
const home = require('../controllers/home');
const package = require('../controllers/package');
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

// ----------  Package Routes  ----------
router.get('/checkout/:packageId', isAuth, package.createOrder);
router.post('/checkout/success', isAuth, package.purchasePackage);

module.exports = router;

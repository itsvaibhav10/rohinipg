// ---------------   Module Imports  ---------------
const express = require('express');
const { isAuth, isAdmin } = require('../../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Manage Notifications Routes  ----------
router.get('/create-notification', isAuth, isAdmin);
router.post('/create-notification', isAuth, isAdmin);
router.post('/send-notification', isAuth, isAdmin);

module.exports = router;

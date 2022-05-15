// ---------------   Module Imports  ---------------
const express = require('express');
const admin = require('../../controllers/admin/admin');
const { isAuth, isAdmin } = require('../../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Admin Home Routes  ----------
router.get('/', isAuth, isAdmin, admin.adminHome);

module.exports = router;

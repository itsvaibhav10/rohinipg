// ---------------   Module Imports  ---------------
const express = require('express');
const property = require('../../controllers/admin/property');
const { isAuth, isAdmin } = require('../../middleware/is-auth');
const { body, check } = require('express-validator');

// Initializing Router
const router = express.Router();

// ----------  Get All Property  ----------
router.get('/properties', isAuth, isAdmin, property.getProperties);

// ----------  Delete Property  ----------
router.post('/delete-property', isAuth, isAdmin, property.delProperty);

// ----------  Verify Property  ----------
router.get(
  '/verify-property/:propId',
  isAuth,
  isAdmin,
  property.verifyProperty
);

// ----------  Activate Property  ----------
router.get(
  '/activate-property/:propId',
  isAuth,
  isAdmin,
  property.activateProperty
);

module.exports = router;

// ---------------   Module Imports  ---------------
const express = require('express');
const package = require('../../controllers/admin/package');
const { isAuth, isAdmin } = require('../../middleware/is-auth');
const { body, check } = require('express-validator');

// Initializing Router
const router = express.Router();

// ----------  Get All Packages  ----------
router.get('/packages', isAuth, isAdmin, package.getPackages);

// ----------  Get Package  ----------
router.get('/package/:packageId', isAuth, isAdmin, package.getPackage);

// ----------  Add Package  ----------
router.get('/add-package', isAuth, isAdmin, package.getAddNewPackage);
router.post(
  '/add-package',
  isAuth,
  isAdmin,
  [
    body('name', 'Name Cant be Empty').not().isEmpty().trim(),
    body('validity', 'Please Select Validity Period').not().isEmpty().trim(),
    body('price', 'Please enter a Valid MRP for Package.')
      .not()
      .isEmpty()
      .trim(),
    body('propertyLimit', 'Please Enter Valid Limit for the Package')
      .not()
      .isEmpty()
      .trim(),
  ],
  package.postAddNewPackage
);

// ----------  Edit Package  ----------
router.get('/edit-package/:packageId', isAuth, isAdmin, package.getEditPackage);
router.post(
  '/edit-package',
  isAuth,
  isAdmin,
  [
    body('name', 'Name Cant be Empty').not().isEmpty().trim(),
    body('validity', 'Please Select Validity Period').not().isEmpty().trim(),
    body('price', 'Please enter a Valid MRP for Package.')
      .not()
      .isEmpty()
      .trim(),
    body('propertyLimit', 'Please Enter Valid Limit for the Package')
      .not()
      .isEmpty()
      .trim(),
  ],
  package.postEditPackage
);

// ----------  Delete Package  ----------
router.get('/delete-package/:packageId', isAuth, isAdmin, package.delPackage);

// ----------  Activate Package  ----------
router.get(
  '/activate-package/:packageId',
  isAuth,
  isAdmin,
  package.activatePackage
);

module.exports = router;

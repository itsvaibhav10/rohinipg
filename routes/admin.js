// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const admin = require('../controllers/admin/admin');
const master = require('../controllers/admin/master');
const user = require('../controllers/admin/users');
const property = require('../controllers/admin/property');
const enquiry = require('../controllers/admin/enquiry');
const { isAuthAdmin } = require('../middleware/is-auth');
const { body, check } = require('express-validator');

// Initializing Router
const router = express.Router();

// ----------  Admin Home Routes  ----------
router.get('/', isAuthAdmin, admin.adminHome);

// ----------  Masters Routes  ----------
router.get('/masters', isAuthAdmin, master.getMasters);
router.get('/master', isAuthAdmin, master.getMaster);
router.post('/masterItem', isAuthAdmin, master.addMasterItem);
router.get('/del-masterItem', isAuthAdmin, master.delMasterItem);

// ----------  Manage Users Routes  ----------
router.get('/users', isAuthAdmin, user.getUsers);
router.get('/user/:userId', isAuthAdmin, user.getUser);
router.get('/add-user', isAuthAdmin, user.getAddNewUser);
router.post(
  '/add-user',
  [
    check('mobile')
      .isLength({ min: 10, max: 10 })
      .withMessage('Please enter a valid 10 digit Mobile no.')
      .custom((value, { req }) => {
        return User.findOne({ mobile: value, mobileVerify: true }).then(
          (userDoc) => {
            if (userDoc) {
              return Promise.reject(
                'Mobile no exists already, please pick a different one.'
              );
            }
          }
        );
      }),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('firstName', 'First Name Cant be Empty').not().isEmpty().trim(),
    body('lastName', 'Last Name Cant be Empty').not().isEmpty().trim(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      // .matches('(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}')
      .isLength({ min: 8 })
      .trim(),
  ],
  isAuthAdmin,
  user.postAddNewUser
);
router.get('/edit-user/:userId', isAuthAdmin, user.getEditUser);
router.post(
  '/edit-user',
  isAuthAdmin,
  [
    body('mobile', 'Mobile is invalid').isLength({ min: 10, max: 10 }),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('firstName', 'First Name Cant be Empty').not().isEmpty().trim(),
    body('lastName', 'Last Name Cant be Empty').not().isEmpty().trim(),
  ],
  user.postEditUser
);
router.get('/delete-user/:userId', isAuthAdmin, user.delUser);

// ----------  Manage Property Routes  ----------
router.get('/properties', isAuthAdmin, property.getProperties);
router.post('/delete-property', isAuthAdmin, property.delProperty);
router.get('/verify-property/:propId', isAuthAdmin, property.verifyProperty);
router.get(
  '/activate-property/:propId',
  isAuthAdmin,
  property.activateProperty
);

// ----------  Manage Enquries Routes  ----------
router.get('/enquiries', isAuthAdmin, enquiry.getEnquiries);
router.get('/enquiry-status/:enquiryId', isAuthAdmin, enquiry.changeStatus);

// ----------  Manage Notifications Routes  ----------
router.get('/create-notification', isAuthAdmin);
router.post('/create-notification', isAuthAdmin);
router.post('/send-notification', isAuthAdmin);

module.exports = router;

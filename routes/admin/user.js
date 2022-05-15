// ---------------   Module Imports  ---------------
const express = require('express');
const User = require('../../models/user');
const user = require('../../controllers/admin/users');
const { isAuth, isAdmin } = require('../../middleware/is-auth');
const { body, check } = require('express-validator');

// Initializing Router
const router = express.Router();

// ----------  Get All Users Details  ----------
router.get('/users', isAuth, isAdmin, user.getUsers);

// ----------  Get User Details  ----------
router.get('/user/:userId', isAuth, isAdmin, user.getUser);

// ----------  Add New User  ----------
router.get('/add-user', isAuth, isAdmin, user.getAddNewUser);
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
  isAuth,
  isAdmin,
  user.postAddNewUser
);

// ----------  Edit User  ----------
router.get('/edit-user/:userId', isAuth, isAdmin, user.getEditUser);
router.post(
  '/edit-user',
  isAuth,
  isAdmin,
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

// ----------  Delete User  ----------
router.get('/delete-user/:userId', isAuth, isAdmin, user.delUser);

module.exports = router;

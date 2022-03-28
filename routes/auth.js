// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const passport = require('passport');
const { check, body } = require('express-validator');
const { getSignup, postSignup } = require('../controllers/auth/signup');
const {
  getLogin,
  postLogin,
  googleLogin,
  logout,
} = require('../controllers/auth/login');
const {
  getVerifyUser,
  postVerifyUser,
  resendOtp,
} = require('../controllers/auth/verify');
const {
  getNewPassword,
  getReset,
  postNewPassword,
  postReset,
} = require('../controllers/auth/reset');
const { isNotAuth, isAuth } = require('../middleware/is-auth');

// passportConfig
const googleStrategy = require('../middleware/passport');

// Initializing Router
const router = express.Router();

// ---------------  Google Routes  ---------------
router.get(
  '/auth/google',
  isNotAuth,
  googleStrategy,
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  })
);

router.get(
  '/auth/google/callback',
  isNotAuth,
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleLogin
);

// ---------------  Sign UP  ---------------
router.get('/signup', isNotAuth, getSignup);
router.post(
  '/signup',
  isNotAuth,
  [
    body('fname', `First Name Can't Be Empty`).trim().not().isEmpty(),
    body('lname', `Last Name Can't Be Empty`).trim().not().isEmpty(),
    body('mobile', 'Mobile no is not valid.')
      .trim()
      .isLength({ min: 10, max: 10 })
      .custom((value, { req }) => {
        return User.findOne({ mobile: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'Mobile no exists already, please pick a different one.'
            );
          }
        });
      }),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      // .matches('(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}')
      .trim()
      .isLength({ min: 8 }),
  ],
  postSignup
);

// ---------------  Verify User  ---------------
router.get('/verify/:token', isNotAuth, getVerifyUser);
router.post('/verify', isNotAuth, postVerifyUser);
router.get('/resend-otp/:userId', isNotAuth, resendOtp);

// ---------------  Login  ---------------
router.get('/login', isNotAuth, getLogin);
router.post(
  '/login',
  isNotAuth,
  [
    body('mobile', 'Mobile no is not valid.')
      .trim()
      .isLength({ min: 10, max: 10 }),
    body('password', 'Password has to be valid.').trim().isLength({ min: 8 }),
  ],
  postLogin
);

// ---------------  Logout  ---------------
router.post('/logout', isAuth, logout);
router.get('/logout', isAuth, logout);

// ---------------  Reset Password  ---------------
router.get('/reset', isNotAuth, getReset);
router.post('/reset', isNotAuth, postReset);
router.get('/new-password/:userId', isNotAuth, getNewPassword);
router.post('/new-password', isNotAuth, postNewPassword);

module.exports = router;

// ---------------   Models  ---------------
const User = require('../models/user');

// ---------------   Module Imports  ---------------
const express = require('express');
const passport = require('passport');
const { check, body } = require('express-validator');
const signup = require('../controllers/auth/signup');
const login = require('../controllers/auth/login');
const verify = require('../controllers/auth/verify');
const reset = require('../controllers/auth/reset');
const { isNotAuth, isAuth } = require('../middleware/is-auth');

// Passport Configuration
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
  login.googleLogin
);

// ---------------  Sign UP  ---------------
router.get('/signup', isNotAuth, signup.getSignup);
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
  signup.postSignup
);

// ---------------  Verify User  ---------------
router.get('/verify/:token', isNotAuth, verify.getVerifyUser);
router.post('/verify', isNotAuth, verify.postVerifyUser);
router.get('/resend-otp/:userId', isNotAuth, verify.resendOtp);

// ---------------  Login  ---------------
router.get('/login', isNotAuth, login.getLogin);
router.post(
  '/login',
  isNotAuth,
  [
    body('mobile', 'Mobile no is not valid.')
      .trim()
      .isLength({ min: 10, max: 10 }),
    body('password', 'Password has to be valid.').trim().isLength({ min: 8 }),
  ],
  login.postLogin
);

// ---------------  Logout  ---------------
router.post('/logout', isAuth, login.logout);
router.get('/logout', isAuth, login.logout);

// ---------------  Reset Password  ---------------
router.get('/reset', isNotAuth, reset.getReset);
router.post('/reset', isNotAuth, reset.postReset);
router.get('/new-password/:userId', isNotAuth, reset.getNewPassword);
router.post('/new-password', isNotAuth, reset.postNewPassword);

module.exports = router;

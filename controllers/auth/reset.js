// ---------------   Models  ---------------
const User = require('../../models/user');

// ---------------   Module Imports  ---------------
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// ---------------   Global Functions  ---------------
const { generateOTP, sendOtp } = require('../utility');
const { send } = require('process');

// ---------------   User Password Resetting  ---------------
exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: null,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const mobile = req.body.mobile;
    const user = await User.findOne({ mobile: mobile, mobileVerify: true });
    if (!user) {
      return res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: 'No account with that Mobile found please Sign up.',
      });
    }
    sendOtp(user._id);
    res.redirect(`/new-password/${user._id}`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: null,
      userId: req.params.userId,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const otp = req.body.otp;
    const newPassword = req.body.password;

    const user = await User.findOne({ _id: userId, otp: otp });

    if (!user) return res.send({ errorMessage: 'Invalid OTP' });
    else if (user.otpExpiry < Date.now())
      return res.send({ errorMessage: 'OTP Expired' });
    else {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      res.send({
        url: '/login',
        successMessage: 'Password Successfully Reset',
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

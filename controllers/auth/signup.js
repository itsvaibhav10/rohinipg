// ---------------   Models  ---------------
const User = require('../../models/user');

// ---------------   Module Imports  ---------------
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const fetch = require('node-fetch');
const { stringify } = require('querystring');

// ---------------   Global Functions  ---------------
const { sendOtp } = require('../utility');

// ---------------   User Signup Operations  ---------------
exports.getSignup = async (req, res, next) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
        name: '',
        email: '',
        mobno: '',
        password: '',
      },
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    if (!req.body.captcha)
      return res.json({
        success: false,
        msg: 'Please select captcha',
      });

    // Secret key
    const secretKey = process.env.captcha_secret_key;

    // Verify URL
    const captchaQuery = stringify({
      secret: secretKey,
      response: req.body.captcha,
      remoteip: req.connection.remoteAddress,
    });

    const verifyURL = `https://google.com/recaptcha/api/siteverify?${captchaQuery}`;

    // Make a request to verifyURL
    const body = await fetch(verifyURL).then((res) => res.json());

    // If not successful
    if (body.success !== undefined && !body.success)
      return res.json({
        success: false,
        msg: 'Failed captcha verification',
      });

    // If SuccessFul
    const fname = req.body.fname.trim();
    const lname = req.body.lname.trim();
    const email = req.body.email.trim();
    const mobile = req.body.mobile.trim();
    const password = req.body.password.trim();

    // Checking If User Already Registered
    const userExist = await User.findOne({ mobile });
    if (userExist && userExist.mobileVerify) {
      return res.send({
        success: true,
        dataEntered: true,
        url: `/login`,
      });
    }
    if (userExist && !userExist.mobileVerify) {
      sendOtp(userExist._id);
      return res.send({
        success: true,
        dataEntered: true,
        url: `/verify/${userExist._id}`,
      });
    }

    // Validation Errors Check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: true,
        dataEntered: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          fname: fname,
          lname: lname,
          email: email,
          password: password,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName: fname,
      lastName: lname,
      mobile: mobile,
      email: email,
      password: hashedPassword,
    });

    sendOtp(user._id);

    res.status(200).json({
      success: true,
      dataEntered: true,
      url: `/verify/${user._id}`,
    });
    
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

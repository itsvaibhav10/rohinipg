// ---------------   Models  ---------------
const User = require('../../models/user');

// ---------------   Module Imports  ---------------
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { urltracker, isPackageExpired } = require('../utility');

// ---------------   User Login Operations  ---------------
exports.getLogin = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
  });
};

exports.postLogin = async (req, res) => {
  const mobile = req.body.mobile;
  const password = req.body.password;
  const errors = validationResult(req);

  const sendData = {
    path: '/login',
    pageTitle: 'Login',
    oldInput: { mobile, password },
  };

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      ...sendData,
      errorMessage: errors.array()[0].msg,
    });
  }
  const user = await User.findOne({ mobile });
  if (!user) {
    return res.status(422).render('auth/login', {
      errorMessage: 'User Not Found Please Check Entered Email',
      ...sendData,
    });
  } else {
    if (user.mobileVerify !== true) {
      return res.status(422).render('auth/login', {
        errorMessage: 'Not Verified',
        ...sendData,
      });
    } else {
      const doMatch = await bcrypt.compare(password, user.password);
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(async (err) => {
          const url =
            req.session && req.session.url ? req.session.url : '/home';
          return res.redirect(url);
        });
      }
      return res.status(422).render('auth/login', {
        errorMessage: 'Invalid Password.',
        ...sendData,
      });
    }
  }
};

exports.googleLogin = (req, res) => {
  if (req.user) {
    const user = req.user;
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save((err) => {
      return res.redirect('/home');
    });
  } else {
    res.redirect('/login');
  }
};

// ---------------   Logout User Function  ---------------
exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    const url = req.session && req.session.url ? req.session.url : '/home';
    return res.redirect(url);
  });
};

// ---------------   Models  ---------------
const User = require('../../models/user');
const Property = require('../../models/property');

// ---------------   Utility  ---------------
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { delSession } = require('../utility');

exports.getUsers = async (req, res) => {
  const users = await User.find().lean();
  res.render('admin/userTable', {
    users: users,
    pageTitle: 'Users Table',
  });
};

exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId, {
    _id: false,
    password: false,
    __v: false,
    updatedAt: false,
    createdAt: false,
    customerType: false,
    subscriptionType: false,
    profileComplete: false,
  }).lean();
  if (!user) throw Error('User Not Found');
  const userProperties = await Property.find({ userId: userId }).lean();
  res.render('admin/userDetails', {
    pageTitle: 'User Details',
    user: user,
    property: userProperties,
  });
};

exports.delUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).lean();
  if (!user) throw Error('User Not Found');
  await delSession(userId);
  await User.deleteOne({ _id: userId });
  return res.redirect('/admin/users');
};

exports.getAddNewUser = (req, res) => {
  res.render('admin/manage_user', {
    pageTitle: 'Add New User',
    oldInput: '',
    errMsg: '',
    editing: false,
  });
};

exports.postAddNewUser = async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin ? true : false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).render('admin/manage_user', {
      pageTitle: 'Add New User',
      oldInput: req.body,
      errMsg: errors.array()[0].msg,
      editing: false,
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      email: email,
      password: hashedPassword,
      isAdmin: isAdmin,
      mobileVerify: true,
    });
    res.redirect('/admin/users');
  }
};

exports.getEditUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).lean();
  if (!user) return res.redirect('/home');
  else {
    res.render('admin/manage_user', {
      pageTitle: 'Edit User',
      oldInput: user,
      errMsg: '',
      editing: true,
    });
  }
};

exports.postEditUser = async (req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const isAdmin = req.body.isAdmin ? true : false;
  const errors = validationResult(req);
  const user = await User.findById(userId);
  if (!user) return res.redirect('/admin');
  if (!errors.isEmpty()) {
    return res.status(404).render('admin/manage_user', {
      pageTitle: 'Edit User',
      oldInput: {
        ...req.body,
        _id: userId,
      },
      errMsg: errors.array()[0].msg,
      editing: true,
    });
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.mobile = mobile;
  user.email = email;
  user.isAdmin = isAdmin;
  await user.save();
  res.redirect('/admin/users');
};

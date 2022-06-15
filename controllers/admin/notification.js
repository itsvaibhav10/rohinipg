const Notification = require('../../models/notification');
const User = require('../../models/user');
const { validationResult } = require('express-validator');
const { dateDifference } = require('../utility');

// Creating Notification
exports.getCreateNotification = (req, res) => {
  res.render('admin/manage_notification', {
    pageTitle: 'Add New Notification',
    editing: false,
    errMsg: null,
    oldInput: {},
  });
};

exports.postCreateNotification = async (req, res) => {
  // res.json(req.body);
  const { title, description, active, expiry } = req.body;
  const errors = validationResult(req);
  const validActiveDate = dateDifference(new Date(), active);
  const validExpiryDate = dateDifference(active, expiry);

  const data = {
    pageTitle: 'Add New Notification',
    editing: false,
    errMsg: null,
    oldInput: null,
  };

  if (validActiveDate < -1 || validExpiryDate < 1) {
    return res.render('admin/manage_notification', {
      ...data,
      oldInput: req.body,
      errMsg: 'Please Select Valid Active and Expiry dates',
    });
  }

  if (!errors.isEmpty()) {
    return res.render('admin/manage_notification', {
      ...data,
      oldInput: req.body,
    });
  }

  await Notification.create({
    title,
    description,
    active,
    expiry,
  });
  res.redirect('/admin/notifications');
};

// Read Notifications
exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find().lean();
  res.render('admin/notificationTable', {
    pageTitle: 'Notification Table',
    notifications,
  });
};

// Updating Notification
exports.getEditNotification = async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId).lean();
  res.render('admin/manage_notification', {
    pageTitle: 'Edit Notification',
    editing: true,
    oldInput: null,
    notification,
  });
};

exports.postEditNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/manage_notification', {
      pageTitle: 'Edit Notification',
      editing: true,
      oldInput: req.body,
    });
  }

  const { title, description, active, expiry, notificationId } = req.body;
  const notification = await Notification.findById(notificationId);
  notification.title = title;
  notification.description = description;
  notification.active = active;
  notification.expiry = expiry;
  res.redirect('/admin/notifications');
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId).lean();
  if (!notification) throw Error('Notification Not Found');

  // Find All User who have thhis notification
  const users = await User.find({ notifications: notificationId });

  users.forEach(async (u) => {
    const notificationIndex = u.notifications.findIndex(
      (n) => n === notificationId
    );
    if (notificationIndex !== -1) {
      u.notifications.splice(notificationIndex, 1);
      await u.save();
    }
  });

  await Notification.deleteOne({ _id: notificationId });
  res.redirect('/admin/notifications');
};

// Send Notification to selected Users
exports.getSendNotification = async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId).lean();
  if (!notification) throw Error('Notification Not Found');

  res.render('admin/send_notification', {
    pageTitle: 'Send Notification',
    notification,
  });
};

exports.postSendNotification = async (req, res) => {
  const { notificationId, userType, paidType } = req.body;
  const notification = await Notification.findById(notificationId).lean();
  if (!notification) throw Error('Notification Not Found');
  const query =
    userType === 'provider'
      ? {
          typeOfUser: 'provider',
          packageId: { $exists: paidType === 'paid' ? true : false },
        }
      : {
          typeOfUser: 'tenant',
        };

  const users = await User.find(query);
  users.forEach(async (u) => {
    const notificationIndex = u.notifications.findIndex(
      (n) => n === notificationId
    );
    if (notificationIndex === -1) {
      u.notifications.push(notificationId);
      await u.save();
    }
  });
  res.redirect('/admin/notifications');
};

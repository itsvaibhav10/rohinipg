const Notification = require('../../models/notification');
const User = require('../../models/user');
const { validationResult } = require('express-validator');

// Creating Notification
exports.getCreateNotification = (req, res) => {
  res.render('admin/manage_notification', {
    pageTitle: 'Add New Notification',
    editing: false,
    oldInput: null,
  });
};

exports.postCreateNotification = async (req, res) => {
  const { title, description, active, expiry } = req.body;
  const errors = validationResult(req);
  const data = {
    pageTitle: 'Add New Notification',
    editing: false,
    oldInput: null,
  };

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

  const users = await User.find(
    {},
    { _id: true, firstName: true, lastName: true, typeOfUser: true }
  ).lean();

  res.render('admin/send_notification', {
    pageTitle: 'Send Notification',
    notification,
    users,
  });
};

exports.postSendNotification = async (req, res) => {
  const { notificationId, usersId } = req.body;
  const notification = await Notification.findById(notificationId).lean();
  if (!notification) throw Error('Notification Not Found');
  const users = await User.find({ _id: usersId });
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

// ---------------   Module Imports  ---------------
const express = require('express');
const { isAuth, isAdmin } = require('../../middleware/is-auth');
const notification = require('../../controllers/admin/notification');

// Initializing Router
const router = express.Router();

// ----------  Manage Notifications Routes  ----------
router.get('/notifications', isAuth, isAdmin, notification.getNotifications);

router.get(
  '/create-notification',
  isAuth,
  isAdmin,
  notification.getCreateNotification
);

router.post(
  '/create-notification',
  isAuth,
  isAdmin,
  notification.postCreateNotification
);

router.get(
  '/send-notification/:notificationId',
  isAuth,
  isAdmin,
  notification.getSendNotification
);

router.post(
  '/send-notification',
  isAuth,
  isAdmin,
  notification.postSendNotification
);

router.get(
  '/delete-notification/:notificationId',
  isAuth,
  isAdmin,
  notification.deleteNotification
);

module.exports = router;

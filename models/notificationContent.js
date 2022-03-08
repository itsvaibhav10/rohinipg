const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationContentSchema = new Schema({
  title: String,
  description: String,
  link: String,
  activeDate: Date,
  expiry: Date,
});

module.exports = mongoose.model(
  'notificationContent',
  notificationContentSchema
);

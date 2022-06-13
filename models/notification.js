const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    active: { type: Date, default: false },
    expiry: { type: Date },
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('notification', notificationSchema);

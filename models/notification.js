const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notifications: { type: Array, default: [] },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('notification', notificationSchema);

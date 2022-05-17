const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    packageId: { type: Schema.Types.ObjectId, required: true, ref: 'Package' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    razorpay: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  books: [
    {
      book: { type: Object, required: true },
      time: { type: String, required: true },
      paperback: { type: Boolean, required: true },
      quiz: { type: Array, required: true, default: [] },
    },
  ],
  user: {
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  razorpay: { type: Object, required: true },
  paid: String,
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    type: { type: String, required: true },
    customerType: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: false },
    validity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    propertyLimit: { type: Number, default: 0 },
    enrolled: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },

    // Main Factor For Ranking Property and Priortize Service
    priority: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);

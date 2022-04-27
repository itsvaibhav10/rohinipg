const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    validity: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    price: { type: Number, required: true },
    propertyLimit: { type: Number, required: true },
    enrolled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);

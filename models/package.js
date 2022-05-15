const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    validity: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    price: { type: Number, required: true },
    propertyLimit: { type: Number, required: true },
    enrolled: { type: Number, default: 0 },
    msg: { type: Boolean, default: false },
    mail: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);

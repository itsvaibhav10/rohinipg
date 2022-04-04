const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    'provider type': { type: String, required: true },
    availability: { type: String, required: true },
    occupancy: { type: String, required: true },
    meals: { type: String, required: true },
    'cable tv': { type: String, required: true },
    internet: { type: String, required: true },
    'table chair': { type: String, required: true },
    locker: { type: String, required: true },
    'bed type': { type: String, required: true },
    parking: { type: String, required: true },
    laundry: { type: String, required: true },
    'door timings': { type: String, required: true },
    safety: { type: String, required: true },
    'water type': { type: String, required: true },
    'hot water': { type: String, required: true },
    'water supply': { type: String, required: true },
    deposit: { type: String, required: true },
    'room cooling': { type: String, required: true },
    electricity: { type: String, required: true },
    seats: { type: String, required: true },
    rent: { type: String, required: true },
    video: { type: String, default: '' },
    visits: { type: Number, default: 0 },
    pgImages: { type: Array, required: true },
    isVerified: { type: Boolean, default: false },
    visits: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    area: { type: String, required: true },
    // search: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);

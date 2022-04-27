const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    pgImages: {
      room: { type: Array, default: [] },
      kitchen: { type: Array, default: [] },
      balcony: { type: Array, default: [] },
      exterior: { type: Array, default: [] },
      livingRoom: { type: Array, default: [] },
      bathroom: { type: Array, default: [] },
      defaults: { type: Array, default: [] },
    },

    title: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, lowercase: true, trim: true },
    houseNo: { type: String, required: true, lowercase: true, trim: true },
    street: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, required: true, lowercase: true, trim: true },
    state: { type: String, required: true, lowercase: true, trim: true },
    pincode: { type: Number, required: true },
    seats: { type: String, required: true, lowercase: true, trim: true },
    rent: { type: Array, required: true },
    area: { type: String, required: true },
    'provider type': {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    availability: { type: String, required: true, lowercase: true, trim: true },
    occupancy: { type: String, required: true, lowercase: true, trim: true },
    meals: { type: String, required: true, lowercase: true, trim: true },
    'cable tv': { type: String, required: true, lowercase: true, trim: true },
    internet: { type: String, required: true, lowercase: true, trim: true },
    'table chair': {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    locker: { type: String, required: true, lowercase: true, trim: true },
    'bed type': { type: String, required: true, lowercase: true, trim: true },
    parking: { type: String, required: true, lowercase: true, trim: true },
    laundry: { type: String, required: true, lowercase: true, trim: true },
    'door timings': {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    safety: { type: String, required: true, lowercase: true, trim: true },
    'water type': { type: String, required: true, lowercase: true, trim: true },
    'hot water': { type: String, required: true, lowercase: true, trim: true },
    'water supply': {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    deposit: { type: String, required: true, lowercase: true, trim: true },
    'room cooling': {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    electricity: { type: String, required: true, lowercase: true, trim: true },
    furnished: { type: String, required: true, lowercase: true, trim: true },
    bathrooms: { type: String, required: true, lowercase: true, trim: true },
    facing: { type: String, required: true, lowercase: true, trim: true },
    'lift facility': {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    video: { type: String, default: '' },
    visits: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    progress: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);

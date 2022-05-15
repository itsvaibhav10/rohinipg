const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    // Property Id Which its belong to
    propId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },

    // Images of The Room
    roomImages: { type: Array, default: [] },

    // Details About Room
    roomDetails: {
      title: { type: String, required: true, lowercase: true, trim: true },
      description: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      seats: { type: String, required: true, lowercase: true, trim: true },
      rent: { type: Array, required: true },
      area: { type: String, required: true },
      occupancy: { type: String, required: true, lowercase: true, trim: true },
      'table chair': {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      locker: { type: String, required: true, lowercase: true, trim: true },
      'bed type': { type: String, required: true, lowercase: true, trim: true },
      'room cooling': {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      bathroom: { type: String, required: true, lowercase: true, trim: true },
      video: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);

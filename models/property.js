const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    pgImages: [
      {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
        category: { type: String, required: true },
        default: { type: Boolean, default: false },
      },
    ],
    pgDetails: {},
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: { type: String, default: '' },
    views: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    visits: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: false },
    progress: { type: Number, default: 50 },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    priority: { type: Number, default: 5 },
    flexiPriority: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);

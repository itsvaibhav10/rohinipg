const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    // Property Id Which its belong to
    propId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },

    // Images of The Room
    roomImages: [
      {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
        category: { type: String, required: true },
        default: { type: Boolean, default: false },
      },
    ],

    // Details About Room
    roomDetails: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);

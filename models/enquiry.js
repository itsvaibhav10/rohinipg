const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enquirySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);

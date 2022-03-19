const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  facilities: { type: Object, required: true },
  visits: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  pgImages: { type: Array, required: true },
}); 

module.exports = mongoose.model('Maintain', propertySchema);

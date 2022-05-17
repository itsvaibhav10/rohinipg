const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    rating: { type: Number, required: true },
    review: String,
    name: { type: String, required: true },
    flag: { type: Boolean, default: false },
    dor: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);

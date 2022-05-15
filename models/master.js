const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterSchema = new Schema({
  name: { type: String, lowercase: true, trim: true, required: true },
  type: { type: String, lowercase: true, trim: true, default: 'property' },
  items: [{ type: String, lowercase: true, trim: true }],
});

module.exports = mongoose.model('Master', masterSchema);

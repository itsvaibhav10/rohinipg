const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterSchema = new Schema({
  'provider type': [{ type: String, trim: true }],
  availability: [{ type: String, trim: true }],
  occupancy: [{ type: String, trim: true }],
  meals: [{ type: String, trim: true }],
  'cable tv': [{ type: String, trim: true }],
  internet: [{ type: String, trim: true }],
  'table chair': [{ type: String, trim: true }],
  locker: [{ type: String, trim: true }],
  'bed type': [{ type: String, trim: true }],
  parking: [{ type: String, trim: true }],
  laundry: [{ type: String, trim: true }],
  'door timings': [{ type: String, trim: true }],
  safety: [{ type: String, trim: true }],
  'water type': [{ type: String, trim: true }],
  'hot water': [{ type: String, trim: true }],
  'water supply': [{ type: String, trim: true }],
  deposit: [{ type: String, trim: true }],
  'room cooling': [{ type: String, trim: true }],
  electricity: [{ type: String, trim: true }],
  furnished: [{ type: String, trim: true }],
  facing: [{ type: String, trim: true }],
  'lift facility': [{ type: String, trim: true }],
});

module.exports = mongoose.model('Master', masterSchema);

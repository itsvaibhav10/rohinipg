const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterSchema = new Schema({
  'provider type': { type: Array, default: [] },
  'availability': { type: Array, default: [] },
  'occupancy': { type: Array, default: [] },
  'meals': { type: Array, default: [] },
  'cable tv': { type: Array, default: [] },
  'internet': { type: Array, default: [] },
  'table chair': { type: Array, default: [] },
  'locker': { type: Array, default: [] },
  'bed type': { type: Array, default: [] },
  'parking': { type: Array, default: [] },
  'laundry': { type: Array, default: [] },
  'door timings': { type: Array, default: [] },
  'safety': { type: Array, default: [] },
  'water type': { type: Array, default: [] },
  'hot water': { type: Array, default: [] },
  'water supply': { type: Array, default: [] },
  'deposit': { type: Array, default: [] },
  'room cooling': { type: Array, default: [] },
  'electricity': { type: Array, default: [] },
});

module.exports = mongoose.model('Master', masterSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterSchema = new Schema({
  cableTv: { type: Array, default: [] },
  internet: { type: Array, default: [] },
  tableChair: { type: Array, default: [] },
  locker: { type: Array, default: [] },
  bedType: { type: Array, default: [] },
  parking: { type: Array, default: [] },
  laundry: { type: Array, default: [] },
  doorTimings: { type: Array, default: [] },
  safety: { type: Array, default: [] },
  waterType: { type: Array, default: [] },
  hotWater: { type: Array, default: [] },
  waterSupply: { type: Array, default: [] },
  deposit: { type: Array, default: [] },
  roomCooling: { type: Array, default: [] },
  electricity: { type: Array, default: [] },
  meals: { type: Array, default: [] },
  occupancy: { type: Array, default: [] },
  availability: { type: Array, default: [] },
  providerType: { type: Array, default: [] },
});

module.exports = mongoose.model('Master', masterSchema);

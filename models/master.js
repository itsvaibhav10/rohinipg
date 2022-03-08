const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterSchema = new Schema({
  category: { type: Array, default: [] },
  class: { type: Array, default: [] },
  subject: { type: Array, default: [] },
  publicationHouse: { type: Array, default: [] },
  subcode: { type: Array, default: [] },
  board: { type: Array, default: [] },
});

module.exports = mongoose.model('Master', masterSchema);

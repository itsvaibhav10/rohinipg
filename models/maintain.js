const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const maintainSchema = new Schema({
  lastCheck: { type: Number, default: Date.now },
});

module.exports = mongoose.model('Maintain', maintainSchema);

// ----------  Modules Import  ----------
const Property = require('../../models/property');
const User = require('../../models/user');
const Room = require('../../models/room');

// ----------  Room Management  ----------
exports.manageRoom = async (req, res) => {
  const propId = req.params.propId;
  const property = await Property.findById(propId, {
    pgDetails: true,
    rooms: true,
  })
    .lean()
    .populate('rooms')
    .exec();
  res.send(property);
};

// ----------  Room Details Management  ----------
exports.getAddRoom = async (req, res) => {
  const property = await Property.findById(req.params.propId);
  if (!property) throw Error('Property Not Found');
  const user = await User.findById(property.userId);
  res.render('property/room', { pageTitle: 'Add Room', user, property });
};

exports.postAddRoom = async (req, res) => {
  const propId = req.body.propId;
  const title = req.body.title;
  const occupancy = req.body.occupancy;
  const rent = req.body.rent;
};

exports.getEditRoom = async (req, res) => {};
exports.postEditRoom = async (req, res) => {};

// Room Images Management
exports.addRoomImages = async (req, res) => {};
exports.delRoomImages = async (req, res) => {};

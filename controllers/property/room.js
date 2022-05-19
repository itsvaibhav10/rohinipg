// ---------------   Models  ---------------
const Property = require('../../models/property');
const User = require('../../models/user');
const Room = require('../../models/room');
const Master = require('../../models/master');

// ---------------   Module Imports  ---------------
const { readFileSync } = require('fs');
const { deleteFile } = require('../utility');

// ----------  Room Details Management  ----------
exports.getAddRoom = async (req, res) => {
  // Getting Property Id
  const propId = req.params.propId;

  // Checking Property Belong To User
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  }).lean();
  if (!property) throw Error('Property Not Found');

  // Sending All collected Data
  const master = await Master.find({ type: 'room' }).lean();
  res.render('room/add_room', {
    pageTitle: 'Add Room',
    master,
    editing: false,
    room: {},
    propId,
  });
};

exports.postAddRoom = async (req, res) => {
  // return res.send(req.body);
  // Getting Data From Form
  const propId = req.body.propId;

  // Verifying Property
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  });
  if (!property) throw Error('Property Not Found');

  // Generating New Room
  const newRoom = {
    propId,
    roomDetails: { ...req.body, _csrf: '', propId: '' },
  };
  delete newRoom.roomDetails.propId;
  delete newRoom.roomDetails._csrf;

  // Storing Data To Database
  const result = await Room.create(newRoom);
  property.rooms.push(result._id);
  await property.save();
  res.redirect(`/manage-property/${propId}`);
};

exports.getEditRoom = async (req, res) => {
  // Getting Property Id And Room No
  const propId = req.params.propId;
  const idx = req.query.idx;

  // Checking Property Belong To User
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  }).lean();
  if (!property) throw Error('Property Not Found');

  // Getting Room Details
  const room = await Room.findById(property.rooms[idx]);
  if (!room) throw Error('Room Not Found');

  // Sending All  collected data
  const master = await Master.find({ type: 'room' }).lean();
  res.render('room/add_room', {
    pageTitle: 'Edit Room',
    room: room.roomDetails,
    master,
    editing: true,
    roomId: room._id,
    propId,
  });
};

exports.postEditRoom = async (req, res) => {
  // Getting Data From Form
  const propId = req.body.propId;
  const roomId = req.body.roomId;

  // Verifying Property
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  }).lean();
  if (!property) throw Error('Property Not Found');

  // Getting Room Details
  const room = await Room.findOne({ _id: roomId, propId });
  if (!room) throw Error('Room Not Found');

  // Updating Room Details
  room.roomDetails = { ...req.body };
  delete room.roomDetails.propId;
  delete room.roomDetails._csrf;
  delete room.roomDetails.roomId;

  // Storing Data To Database
  const result = await room.save();
  res.redirect(`/manage-property/${propId}`);
};

// Room Images Management
exports.getAddRoomImages = async (req, res) => {
  // Getting Property Id And Room No
  const propId = req.params.propId;
  const idx = req.query.idx;

  // Checking Property Belong To User
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  }).lean();
  if (!property) throw Error('Property Not Found');

  // Getting Room Details
  const room = await Room.findById(property.rooms[idx]);
  if (!room) throw Error('Room Not Found');
  res.render('room/room_images', {
    pageTitle: room.roomDetails.title,
    roomImages: room.roomImages,
    roomDetails: room.roomDetails,
    roomId: room._id,
    propId,
    idx,
  });
};

exports.postAddRoomImages = async (req, res) => {
  // Getting Data From FORM
  const propId = req.body.propId;
  const idx = req.body.idx;
  const roomId = req.body.roomId;

  // Verifying Room
  const room = await Room.findOne({ _id: roomId, propId });
  if (!room) throw Error('Room Not Found');

  // Adding Images To Room
  if (req.files['pg_images'] && req.files['pg_images'].length > 0) {
    const roomImages = req.files['pg_images'].map((i) => {
      return {
        data: readFileSync(i.path),
        contentType: i.mimetype,
      };
    });

    roomImages.forEach((img, idx) => {
      room.roomImages.push(img);
      deleteFile(req.files['pg_images'][idx].path);
    });
  }
  await room.save();
  return res.redirect(`/add-room-images/${propId}?idx=${idx}`);
};

exports.delRoomImages = async (req, res) => {
  // Getting data From FORM
  const imgId = req.body.imgId;
  const propId = req.body.propId;
  const idx = req.body.idx;
  const roomId = req.body.roomId;

  // Verifying Room
  const room = await Room.findOne({ _id: roomId, propId });
  if (!room) throw Error('Room Not Found');

  // Finding Image Index And Delete that IMAGE
  const imgIdx = room.roomImages.findIndex(
    (img) => img._id.toString() === imgId.toString()
  );
  room.roomImages.splice(imgIdx, 1);
  await room.save();

  return res.redirect(`/add-room-images/${propId}?idx=${idx}`);
};

// ---------------   Models  ---------------
const User = require('../../models/user');
const Property = require('../../models/property');

// ---------------   Utility  ---------------
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { deleteFiles } = require('../utility');

exports.getProperties = async (req, res) => {
  const properties = await Property.find().lean();
  res.render('admin/propertyTable', {
    properties: properties,
    pageTitle: 'Properties Table',
  });
};

exports.delProperty = async (req, res) => {
  const propId = req.params.propId;
  const property = await Property.findById(propId).lean();
  if (!property) throw Error('User Not Found');
  const images = property.pgImages.map((p) => p.path);
  deleteFiles(images);
  await Property.deleteOne({ _id: propId });
  return res.redirect('/admin/users');
};

exports.verifyProperty = async (req, res) => {
  const propId = req.params.propId;

  const property = await Property.findById(propId, {
    isVerified: true,
    userId: true,
    verifiedBy: true,
  });

  if (!property) throw Error('Property Not Found');

  if (property.isVerified === false) {
    property.isVerified = true;
    property.verifiedBy = req.user._id;
  } else {
    property.isVerified = false;
  }
  await property.save();
  return res.redirect(`/admin/properties`);
};

exports.activateProperty = async (req, res) => {
  const propId = req.params.propId;
  const property = await Property.findById(propId, {
    isActive: true,
    userId: true,
  });

  if (!property) throw Error('Property Not Found');

  // Convert User to Provider
  const user = await User.findById(property.userId, { typeOfUser: true });
  if (user.typeOfUser !== 'provider') user.typeOfUser = 'provider';

  // Activating Property
  if (property.isActive === false) property.isActive = true;
  else property.isActive = false;
  await property.save();
  return res.redirect(`/admin/properties`);
};

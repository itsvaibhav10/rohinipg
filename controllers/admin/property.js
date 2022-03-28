// ---------------   Models  ---------------
const User = require('../../models/user');
const Property = require('../../models/property');

// ---------------   Utility  ---------------
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { delSession } = require('../utility');

exports.getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().lean();
    res.render('admin/propertyTable', {
      properties: properties,
      pageTitle: 'Properties Table',
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.delProperty = async (req, res, next) => {
  try {
    const propId = req.params.propId;
    console.log(propId);
    const property = await Property.findById(propId).lean();
    if (!property) throw new Error('User Not Found');
    await Property.deleteOne({ _id: propId });
    return res.redirect('/admin/users');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.verifyProperty = async (req, res, next) => {
  try {
    const propId = req.params.propId;
    const property = await Property.findById(propId);
    if (!property) throw new Error('Property Not Found');
    if (property.isVerified === false) property.isVerified = true;
    else {
      property.isVerified = false;
      property.isActive = false;
    }
    await property.save();
    return res.redirect(`/admin/properties`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.activateProperty = async (req, res, next) => {
  try {
    const propId = req.params.propId;
    const property = await Property.findById(propId);
    if (!property) throw new Error('Property Not Found');
    if (!property.isVerified) return res.redirect(`/admin/properties`);
    if (property.isActive === false) property.isActive = true;
    else property.isActive = false;
    await property.save();
    return res.redirect(`/admin/properties`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

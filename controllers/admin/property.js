const Property = require('../../models/property');

exports.getAddProperty = (req, res, next) => {
  res.render('property/add_property', { pageTitle: 'Add Property' });
};
exports.postAddProperty = (req, res, next) => {};

exports.getEditProperty = (req, res, next) => {};
exports.postEditProperty = (req, res, next) => {};

exports.getDeleteProperty = (req, res, next) => {};
exports.postDeleteProperty = (req, res, next) => {};

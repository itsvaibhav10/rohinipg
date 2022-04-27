// ---------------   Models  ---------------
const User = require('../../models/user');
const Property = require('../../models/property');
const Package = require('../../models/package');
const Order = require('../../models/order');

// ---------------   Utility  ---------------
const { validationResult } = require('express-validator');

exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find().lean();
    res.render('admin/packageTable', {
      packages: packages,
      pageTitle: 'Packages Table',
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getPackage = async (req, res, next) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId).lean();
  if (!package) throw new Error('User Not Found');
  const users = await Order.find({ packageId: packageId })
    .lean()
    .populate({
      path: 'userId',
      select: 'firstName lastName mobile',
    })
    .exec();
  res.render('admin/packageDetails', {
    pageTitle: 'Package Details',
    package: package,
    users: users,
  });
};

exports.delPackage = async (req, res, next) => {
  try {
    const packageId = req.params.packageId;
    const package = await Package.findById(packageId).lean();
    if (!package) throw new Error('User Not Found');
    await Package.deleteOne({ _id: packageId });
    return res.redirect('/admin/packages');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddNewPackage = (req, res, next) => {
  res.render('admin/manage_package', {
    pageTitle: 'Add New Package',
    oldInput: '',
    errMsg: '',
    editing: false,
  });
};

exports.postAddNewPackage = async (req, res, next) => {
  try {
    const name = req.body.name;
    const validity = req.body.validity;
    const price = req.body.price;
    const propertyLimit = req.body.propertyLimit;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).render('admin/manage_package', {
        pageTitle: 'Add New Package',
        oldInput: req.body,
        errMsg: errors.array()[0].msg,
        editing: false,
      });
    } else {
      await Package.create({
        name,
        validity,
        price,
        propertyLimit,
      });
      res.redirect('/admin/packages');
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditPackage = async (req, res, next) => {
  try {
    const packageId = req.params.packageId;
    const package = await Package.findById(packageId).lean();
    if (!package) return res.redirect('/home');
    else {
      res.render('admin/manage_package', {
        pageTitle: 'Edit Package',
        oldInput: package,
        errMsg: '',
        editing: true,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditPackage = async (req, res, next) => {
  try {
    const packageId = req.body.packageId;
    const name = req.body.name;
    const validity = req.body.validity;
    const price = req.body.price;
    const propertyLimit = req.body.propertyLimit;
    const errors = validationResult(req);
    const package = await Package.findById(packageId);
    if (!package) return res.redirect('/admin');
    if (!errors.isEmpty()) {
      return res.status(404).render('admin/manage_package', {
        pageTitle: 'Edit Package',
        oldInput: {
          ...req.body,
          _id: packageId,
        },
        errMsg: errors.array()[0].msg,
        editing: true,
      });
    }
    package.name = name;
    package.validity = validity;
    package.price = price;
    package.propertyLimit = propertyLimit;
    await package.save();
    res.redirect('/admin/packages');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.activatePackage = async (req, res, next) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId, { isActive: true });
  if (!package) throw new Error('Package Not Found');
  if (package.isActive === false) package.isActive = true;
  else package.isActive = false;
  await package.save();
  res.redirect('/admin/packages');
};

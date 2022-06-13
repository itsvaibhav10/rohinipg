// ---------------   Models  ---------------
const User = require('../../models/user');
const Property = require('../../models/property');
const Package = require('../../models/package');
const Order = require('../../models/order');

// ---------------   Utility  ---------------
const { validationResult } = require('express-validator');

exports.getPackages = async (req, res) => {
  const { type } = req.params;
  const packages = await Package.find({ type }).lean();
  res.render('admin/packageTable', {
    packages: packages,
    pageTitle: 'Packages Table',
    type,
  });
};

exports.getPackage = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId).lean();
  if (!package) throw Error('User Not Found');
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

exports.delPackage = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId).lean();
  if (!package) throw Error('User Not Found');
  await Package.deleteOne({ _id: packageId });
  return res.redirect('/admin/packages');
};

exports.getAddNewPackage = (req, res) => {
  const { type } = req.params;
  res.render('admin/manage_package', {
    pageTitle: 'Add New Package',
    oldInput: '',
    errMsg: '',
    editing: false,
    type,
  });
};

exports.postAddNewPackage = async (req, res) => {
  const {
    type,
    customerType,
    name,
    validity,
    price,
    priority,
    credits,
    propertyLimit,
    discountedPrice,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).render('admin/manage_package', {
      pageTitle: 'Add New Package',
      oldInput: req.body,
      errMsg: errors.array()[0].msg,
      editing: false,
    });
  }

  await Package.create({
    type,
    customerType,
    name,
    validity,
    price,
    discountedPrice,
    propertyLimit,
    credits,
    priority,
  });

  res.redirect('/admin/packages/' + type);
};

exports.getEditPackage = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId).lean();
  if (!package) return res.redirect('/home');
  res.render('admin/manage_package', {
    pageTitle: 'Edit Package',
    oldInput: package,
    errMsg: '',
    editing: true,
    type: package.type,
  });
};

exports.postEditPackage = async (req, res) => {
  const {
    type,
    customerType,
    name,
    validity,
    price,
    priority,
    credits,
    propertyLimit,
    discountedPrice,
    packageId,
  } = req.body;

  const errors = validationResult(req);
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
  const package = await Package.findById(packageId);
  if (!package) return res.redirect('/admin');

  package.type = type;
  package.customerType = customerType;
  package.name = name;
  package.validity = validity;
  package.price = price;
  package.discountedPrice = discountedPrice;
  package.propertyLimit = propertyLimit;
  package.credits = credits;
  package.priority = priority;
  await package.save();
  res.redirect('/admin/packages/' + type);
};

exports.activatePackage = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId);
  if (!package) throw Error('Package Not Found');
  if (package.isActive === false) package.isActive = true;
  else package.isActive = false;
  await package.save();
  res.redirect('/admin/packages/' + package.type);
};

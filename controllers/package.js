// ---------------   Models  ---------------
const Package = require('../models/package');
const Order = require('../models/order');
const Property = require('../models/property');

// ---------------   Module Imports  ---------------
const Razorpay = require('razorpay');
const instance = new Razorpay({
  key_id: process.env.rzpKeyId,
  key_secret: process.env.rzpSecKey,
});

// ----------  Get All Package  ----------
exports.getPackage = async (req, res) => {
  const packages = await Package.find({ isActive: true, type: 'provider' });
  res.render('home/packages', {
    pageTitle: `Packages`,
    packages,
  });
};

exports.createOrder = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId);
  if (!package) throw Error('Package Not Found');

  const options = {
    amount: package.price * 100,
    currency: 'INR',
    payment_capture: '1',
  };

  const order = await instance.orders.create(options);
  return res.send({
    success: true,
    orderId: order.id,
    totalPrice: package.price,
    packageId,
  });
};

exports.purchasePackage = async (req, res) => {
  const packageId = req.body.PackageId;
  const package = await Package.findById(packageId);
  if (!package) throw Error('Package Not Found');
  await Order.create({
    packageId: packageId,
    userId: req.user._id,
    razorpay: req.body.razorpay,
  });
  req.user.packageId = packageId;
  await req.user.save();
  const properties = await Property.find({ userId: req.user._id });
  if (properties.length > 0) {
    properties.forEach(async (p) => {
      p.priority = package.priority;
      await p.save();
    });
  }
};

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
  // if (!req.user.isAdmin && req.user.packageId) return res.redirect('/home');
  const packages = await Package.find({
    isActive: true,
    customerType: 'provider',
  });
  const membership = packages.filter((p) => p.type === 'membership');
  const credits = packages.filter((p) => p.type === 'credits');

  res.render('home/packages', {
    pageTitle: `Packages`,
    membership,
    credits,
  });
};

exports.createOrder = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId);
  if (!package) throw Error('Package Not Found');

  const options = {
    amount: package.discountedPrice * 100,
    currency: 'INR',
    payment_capture: '1',
  };

  const order = await instance.orders.create(options);
  return res.send({
    success: true,
    orderId: order.id,
    totalPrice: package.discountedPrice,
    packageId,
  });
};

exports.purchasePackage = async (req, res) => {
  const packageId = req.body.packageId;
  const package = await Package.findById(packageId);
  if (!package) throw Error('Package Not Found');

  await Order.create({
    packageId: packageId,
    userId: req.user._id,
    razorpay: req.body.razorpay,
  });

  package.enrolled += 1;
  await package.save();

  req.user.packageId = packageId;
  await req.user.save();

  const properties = await Property.find({ userId: req.user._id });
  if (properties.length > 0) {
    properties.forEach(async (p) => {
      p.priority = package.priority;
      await p.save();
    });
  }

  return res.json({ success: true, url: '/home' });
};

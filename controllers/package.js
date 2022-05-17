const Package = require('../models/package');
const Order = require('../models/order');
const Razorpay = require('razorpay');
const instance = new Razorpay({
  key_id: process.env.rzpKeyId,
  key_secret: process.env.rzpSecKey,
});

exports.getPackage = async (req, res) => {
  const packages = await Package.find({ isActive: true });
  res.render('home/packages', {
    pageTitle: `Packages`,
    packages,
  });
};

exports.createOrder = async (req, res) => {
  const packageId = req.params.packageId;
  const package = await Package.findById(packageId);
  if (!package) throw Error('Package Not Found');
  req.user.packageId = packageId;
  await req.user.save();
  const totalPrice = package.price;
  const options = {
    amount: totalPrice * 100,
    currency: 'INR',
    payment_capture: '1',
  };

  const order = await instance.orders.create(options);
  return res.send({
    success: true,
    orderId: order.id,
    totalPrice: totalPrice,
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
};

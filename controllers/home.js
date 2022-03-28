const Property = require('../models/property');
const User = require('../models/user');
const Enquiry = require('../models/enquiry');

exports.index = (req, res, next) => {
  res.redirect('/home');
};
exports.home = async (req, res, next) => {
  const properties = await Property.find({ isVerified: true, isActive: true })
    .lean()
    .limit(10);
  res.render('home/index', { pageTitle: 'Home', properties });
};

exports.enquiry = async (req, res, next) => {
  const userId = req.body.userId;
  const propId = req.body.propId;
  const user = await User.findById(userId).lean();
  const property = await Property.findById(propId).lean();
  if (!property) throw new Error('Property Not Found');
  if (!user) throw new Error('User Not Found');
  const enquiry = await Enquiry.findOne({ userId: userId, propId }).lean();
  if (enquiry) return res.send({ success: false });
  await Enquiry.create({ userId, propId });
  return res.send({ success: true });
};

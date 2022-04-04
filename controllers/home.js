const Property = require('../models/property');
const User = require('../models/user');
const Enquiry = require('../models/enquiry');
const Master = require('../models/master');

exports.index = (req, res, next) => {
  res.redirect('/home');
};

exports.home = async (req, res, next) => {
  const properties = await Property.find({ isVerified: true, isActive: true })
    .lean()
    .limit(10);
  const master = await Master.findOne().lean();
  res.render('home/index', { pageTitle: 'Home', properties, master });
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

exports.getProperties = async (req, res, next) => {
  const ITEM_PER_PAGE = 10;
  const page = +req.query.page || 1;

  const totalItems = await Property.find({
    isActive: true,
    isVerified: true,
  })
    .countDocuments()
    .lean();

  const properties = await Property.find({
    isActive: true,
    isVerified: true,
  })
    .skip((page - 1) * ITEM_PER_PAGE)
    .limit(ITEM_PER_PAGE)
    .lean();

  const master = await Master.findOne().lean();
  res.render('property/properties', {
    pageTitle: 'Properties',
    properties,
    master,
    currentPage: page,
    hasNextPage: ITEM_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
  });
};

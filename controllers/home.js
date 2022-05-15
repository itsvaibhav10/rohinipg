const Property = require('../models/property');
const User = require('../models/user');
const Enquiry = require('../models/enquiry');
const Master = require('../models/master');

exports.index = (req, res) => {
  res.redirect('/home');
};

exports.home = async (req, res) => {
  const properties = await Property.find({ isActive: true }).lean().limit(10);
  const master = await Master.find({
    name: ['availability'],
  }).lean();
  res.render('home/index', { pageTitle: 'Home', properties, master });
};

exports.enquiry = async (req, res) => {
  const userId = req.body.userId;
  const propId = req.body.propId;
  const user = await User.findById(userId).lean();
  const property = await Property.findById(propId).lean();
  if (!property) throw Error('Property Not Found');
  if (!user) throw Error('User Not Found');
  const enquiry = await Enquiry.findOne({ userId: userId, propId }).lean();
  if (enquiry) return res.send({ success: false });
  await Enquiry.create({ userId, propId });
  return res.send({ success: true });
};

exports.getProperties = async (req, res) => {
  const master = await Master.find({
    name: ['availability'],
  }).lean();
  res.render('property/properties', {
    pageTitle: 'Properties',
    master,
    oldInput: '',
    properties: [],
  });
};

exports.postProperties = async (req, res) => {
  const keywords = req.body.keywords;
  const propertyState = req.body.propertyState;
  const propertyAvailableFor = req.body.propertyAvailableFor;
  const propertyOccupancy = req.body.propertyOccupancy;
  const propertyRent = req.body.propertyRent;
  const propertySeats = req.body.propertySeats;
  const areaMax = req.body.propertyArea.split(',')[1];
  const areaMin = req.body.propertyArea.split(',')[0];

  // Pagintion per Page 10 Items
  const ITEM_PER_PAGE = 10;
  const page = +req.query.page || 1;

  const properties = await Property.find({
    isActive: true,    
    state: propertyState,
    seats: { $gte: propertySeats },
    availability: propertyAvailableFor,
    occupancy: propertyOccupancy,
    area: { $lte: areaMax },
    area: { $gte: areaMin },
    title: { $regex: '.*' + keywords + '.*' },
  })
    .skip((page - 1) * ITEM_PER_PAGE)
    .limit(ITEM_PER_PAGE)
    .lean();

  const totalItems = properties.length;

   const master = await Master.find({
     name: ['availability'],
   }).lean();
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
    oldInput: req.body,
  });
};

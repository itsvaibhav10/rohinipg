// ---------------   Models  ---------------
const Property = require('../../models/property');
const User = require('../../models/user');
const Master = require('../../models/master');
const Package = require('../../models/package');

// ----------  Modules Import  ----------
const { deleteFile, isPackageValid, maskMobile } = require('../utility');
const { sendTenantDetails } = require('../jobs');

const { readFileSync } = require('fs');

const getContact = (provider) => {
  if (provider.packageId)
    return {
      firstName: provider.firstName,
      lastName: provider.lastName,
      mobile: provider.mobile,
    };
  else
    return {
      firstName: 'Vishal',
      lastName: 'Bansal',
      mobile: '9999999999',
    };
};

// ----------  Add Property Details  ----------
exports.getAddPropertyDetails = async (req, res) => {
  // Check Package Limit with Property
  const result = await isPackageValid(req.user._id);
  console.log(result);
  if (!result) return res.redirect('/pricing');

  const master = await Master.find({ type: 'property' }).lean();
  res.render('property/add_property', {
    pageTitle: 'Add Property',
    master,
    editing: false,
    property: {},
  });
};

exports.postAddPropertyDetails = async (req, res) => {
  const { packageId: package } = await User.findById(req.user._id)
    .populate('packageId')
    .exec();

  const newProperty = {
    userId: req.user['_id'],
    pgDetails: { ...req.body, _csrf: undefined },
    priority: package.priority,
  };

  const result = await Property.create(newProperty);
  if (package.name === 'free') return res.redirect('/pricing');
  res.redirect(`/manage-property/${result._id}`);
};

// ----------  Edit Property Details  ----------
exports.getEditPropertyDetails = async (req, res) => {
  const propId = req.params.propId;
  const master = await Master.find({ type: 'property' }).lean();
  let property;
  if (!req.user.isAdmin)
    property = await Property.findOne({
      userId: req.user._id,
      _id: propId,
    }).lean();
  else property = await Property.findById(propId).lean();
  if (!property) return res.redirect('/');
  res.render('property/add_property', {
    pageTitle: 'Edit Property',
    property: property.pgDetails,
    master,
    editing: true,
    propId,
  });
};

exports.postEditPropertyDetails = async (req, res) => {
  const propId = req.body.propId;
  const property = await Property.findById(propId);
  if (!property) throw Error('Property not Found');
  property.pgDetails = { ...req.body, _csrf: undefined, propId: undefined };
  delete property.pgDetails.propId;
  delete property.pgDetails._csrf;
  const result = await property.save();
  res.redirect(`/manage-property/${result._id}`);
};

// ----------  Add Property Images  ----------
exports.getPropertyImages = async (req, res) => {
  const propId = req.params.propId;
  let property;
  if (req.user.isAdmin) property = await Property.findById(propId).lean();
  else
    property = await Property.findOne({
      _id: propId,
      userId: req.user._id,
    }).lean();
  res.render('property/pg_images', {
    pageTitle: property.pgDetails.title,
    property,
  });
};

exports.getAddPropertyImagesCategory = async (req, res) => {
  const propId = req.params.propId;
  const userId = req.user._id;
  const category = req.query.category;
  const catArr = ['kitchen', 'exterior', 'balcony', 'commonArea', 'bathroom'];
  const categoryIdx = catArr.findIndex((cat) => cat === category);
  if (!propId || categoryIdx === -1) throw Error('Property Not Found');
  const property = await Property.findOne(
    { _id: propId, userId },
    { pgImages: true }
  );
  if (!property) throw Error('Property Not Found');
  const pgImages = property.pgImages.filter((i) => i.category === category);
  res.render('property/category_image', {
    pageTitle: category,
    pgImages: pgImages,
    propId,
    category,
  });
};

exports.postAddPropertyImagesCategory = async (req, res) => {
  const propId = req.body.propId;
  const category = req.body.category;
  const userId = req.user._id;
  if (!propId || !category) throw Error('Property Not Found');
  const property = await Property.findOne(
    { _id: propId, userId },
    { pgImages: true, progress: true }
  );
  if (!property) throw Error('Property Not Found');
  if (req.files['pg_images'] && req.files['pg_images'].length > 0) {
    const pgImages = req.files['pg_images'].map((i) => {
      return {
        data: readFileSync(i.path),
        contentType: i.mimetype,
        category: category,
      };
    });

    pgImages.forEach((img, idx) => {
      property.pgImages.push(img);
      deleteFile(req.files['pg_images'][idx].path);
    });
  }
  await property.save();
  return res.redirect(`add-property-images/${propId}?category=${category}`);
};

// ----------  Delete Property Images  ----------
exports.deletePropertyImages = async (req, res) => {
  const propId = req.body.propId;
  const imgId = req.body.imgId;
  const userId = req.user._id;
  const category = req.body.category;
  const property = await Property.findOne({ _id: propId, userId });

  // Finding Image Index And Deleteing that img
  const imgIdx = property.pgImages.findIndex(
    (img) => img._id.toString() === imgId.toString()
  );
  property.pgImages.splice(imgIdx, 1);

  await property.save();
  return res.redirect(`/add-property-images/${propId}?category=${category}`);
};

// ----------  View Property  ----------
exports.viewProperty = async (req, res) => {
  const { propId } = req.params;
  const property = await Property.findById(propId).populate('rooms').exec();
  const provider = await User.findById(property.userId).lean();
  console.log(property.rooms);
  // Adding to property views if current user is neither Admin nor Owner
  if (
    !req.user.isAdmin &&
    property.userId.toString() !== req.user._id.toString()
  ) {
    // Find If Already Added To property views
    const userIndex = property.views.findIndex(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (userIndex === -1) {
      property.views.push(req.user._id);
      await property.save();
      const mobile = maskMobile(req.user.mobile, provider.packageId);
      const msg = `Hi ${provider.firstName}\n${req.user.firstName} ${req.user.lastName} with contact ${mobile}\njust seen your property title - ${property.pgDetails.title}`;
      await sendTenantDetails(provider.packageId, msg, provider.mobile);
    }
  }
  res.render('property/view_property', {
    pageTitle: property.pgDetails['title'],
    property,
    contact: getContact(provider.packageId),
  });
};

// ----------  User Properties Management  ----------
exports.getProperties = async (req, res) => {
  const properties = await Property.find({ userId: req.user._id });
  res.render('property/propertiesList', {
    pageTitle: 'Manage Property',
    properties,
  });
};

exports.manageProperty = async (req, res) => {
  const propId = req.params.propId;
  let query = { _id: propId, userId: req.user._id };
  if (req.user.isAdmin) delete query.userId;

  const property = await Property.findOne(query)
    .lean()
    .populate({ path: 'rooms', select: 'roomDetails.title' })
    .populate({
      path: 'views',
      select: 'firstName lastName mobile',
    })
    .exec();

  property.views.forEach((v) => {
    console.log(v);
    v.mobile = maskMobile(v.mobile, req.user.packageId);
  });

  if (!property) throw Error('Property Not Found');
  res.render('property/manage_property', {
    pageTitle: 'Manage Property',
    property,
  });
};

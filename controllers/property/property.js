// ----------  Modules Import  ----------
const Property = require('../../models/property');
const User = require('../../models/user');
const Master = require('../../models/master');
const Package = require('../../models/package');
const { deleteFile } = require('../utility');
const { readFileSync } = require('fs');

const getPropertyInfo = async (propId, user) => {
  if (user.isAdmin) return await Property.findById(propId).lean();
  else return await Property.findOne({ _id: propId, userId: user._id }).lean();
};

const getContact = async (propId) => {
  const property = await Property.findById(propId, {
    userId: true,
    'provider type': true,
  }).lean();
  const provider = await User.findById(property.userId).lean();
  if (provider.subscriptionType === 'paid')
    return {
      firstName: provider.firstName,
      lastName: provider.lastName,
      mobile: provider.mobile,
      'provider type': property['provider type'],
    };
  else
    return {
      firstName: 'Vishal',
      lastName: 'Bansal',
      mobile: '9999999999',
      'provider type': 'Agent',
    };
};

// ----------  Add Property Details  ----------
exports.getAddPropertyDetails = async (req, res) => {
  const master = await Master.find({ type: 'property' }).lean();
  res.render('property/add_property', {
    pageTitle: 'Add Property',
    master,
    editing: false,
    property: {},
  });
};

exports.postAddPropertyDetails = async (req, res) => {
  const newProperty = {
    userId: req.user['_id'],
    pgDetails: { ...req.body, _csrf: undefined },
  };
  const result = await Property.create(newProperty);
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
  const property = await getPropertyInfo(propId, req.user);
  res.render('property/pg_images', {
    pageTitle: property.title,
    property,
  });
};

exports.getAddPropertyImagesCategory = async (req, res) => {
  const propId = req.params.propId;
  const userId = req.user._id;
  const category = req.query.category;
  if (!propId || !category) throw Error('Property Not Found');
  const property = await Property.findOne(
    { _id: propId, userId },
    { pgImages: true }
  );
  if (!property) throw Error('Property Not Found');
  res.render('property/category_image', {
    pageTitle: category,
    pgImages: property.pgImages,
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
  const propId = req.params.propId;
  const property = await Property.findById(propId);
  if (!property) throw Error('Property Not Found');

  // Adding to response if current user is neither Admin nor Owner
  if (
    !req.user.isAdmin &&
    property.userId.toString() !== req.user._id.toString()
  ) {
    // Find If Already Added To Response
    const userIndex = property.views.findIndex(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (userIndex === -1) {
      property.views.push(req.user._id);
      await property.save();
    }
  }

  res.render('property/view_property', {
    pageTitle: property.pgDetails['title'],
    property,
    contact: await getContact(propId),
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
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  }).lean();
  if (!property) throw Error('Property Not Found');
  res.render('property/manage_property', {
    pageTitle: 'Manage Property',
    property,
  });
};

// ----------  Get All Package  ----------
exports.getPackage = async (req, res) => {
  const packages = await Package.find({ isActive: true });
  res.render('home/packages', {
    pageTitle: `Packages`,
    packages,
  });
};

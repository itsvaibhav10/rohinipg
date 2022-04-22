// ----------  Modules Import  ----------
const Property = require('../models/property');
const Master = require('../models/master');
const { deleteFile } = require('./utility');

const getPropertyInfo = async (propId, user) => {
  if (user.isAdmin) return await Property.findById(propId).lean();
  else return await Property.findOne({ _id: propId, userId: user._id }).lean();
};

// ----------  Property Details  ----------
exports.getAddPropertyDetails = async (req, res, next) => {
  const master = await Master.findOne().lean();
  res.render('property/add_property', {
    pageTitle: 'Add Property',
    master,
    editing: false,
    property: {},
  });
};

exports.postAddPropertyDetails = async (req, res, next) => {
  // return res.send
  try {
    const newProperty = {
      userId: req.user['_id'],
      title: req.body['propertyTitle'],
      description: req.body['propertyDesc'],
      houseNo: req.body['propertyAddress1'],
      street: req.body['propertyAddress2'],
      city: req.body['propertyCity'],
      state: req.body['propertyState'],
      pincode: req.body['propertyPincode'],
      'provider type': req.body['propertyProviderType'],
      availability: req.body['propertyAvailableFor'],
      occupancy: req.body['propertyOccupancy'],
      meals: req.body['propertyFood'],
      'cable tv': req.body['propertyCable'],
      internet: req.body['propertyInternet'],
      'table chair': req.body['propertyTable'],
      locker: req.body['propertyLocker'],
      'bed type': req.body['propertyBedType'],
      parking: req.body['propertyParking'],
      laundry: req.body['propertyLaundry'],
      'door timings': req.body['propertyTimings'],
      safety: req.body['propertySafety'],
      'water type': req.body['propertyDrinkingWaterType'],
      'hot water': req.body['propertyHotWater'],
      'water supply': req.body['propertyWaterSupply'],
      deposit: req.body['propertyDeposit'],
      'room cooling': req.body['propertyRoomCooling'],
      electricity: req.body['propertyElectricity'],
      seats: req.body['propertySeats'],
      rent: req.body['propertyRent'].split(','),
      video: req.body['propertyVideo'],
      area: req.body['propertyArea'],
      'lift facility': req.body['propertyLiftFacility'],
      facing: req.body['propertyFacing'],
      bathrooms: req.body['propertyBathrooms'],
      furnished: req.body['propertyFurnished'],
    };
    const result = await Property.create(newProperty);
    res.redirect(`/manage-property/${result._id}`);
  } catch (err) {
    return next(new Error(err));
  }
};

exports.getEditPropertyDetails = async (req, res, next) => {
  const propId = req.params.propId;
  const master = await Master.findOne().lean();
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
    property,
    master,
    editing: true,
  });
};

exports.postEditPropertyDetails = async (req, res, next) => {
  // return res.send(req.body);
  try {
    const propId = req.body.propId;
    const property = await Property.findById(propId);
    if (!property) throw new Error('Property not Found');
    property['title'] = req.body['propertyTitle'];
    property['description'] = req.body['propertyDesc'];
    property['houseNo'] = req.body['propertyAddress1'];
    property['street'] = req.body['propertyAddress2'];
    property['city'] = req.body['propertyCity'];
    property['state'] = req.body['propertyState'];
    property['pincode'] = req.body['propertyPincode'];
    property['provider type'] = req.body['propertyProviderType'];
    property['availability'] = req.body['propertyAvailableFor'];
    property['occupancy'] = req.body['propertyOccupancy'];
    property['meals'] = req.body['propertyFood'];
    property['cable tv'] = req.body['propertyCable'];
    property['internet'] = req.body['propertyInternet'];
    property['table chair'] = req.body['propertyTable'];
    property['locker'] = req.body['propertyLocker'];
    property['bed type'] = req.body['propertyBedType'];
    property['parking'] = req.body['propertyParking'];
    property['laundry'] = req.body['propertyLaundry'];
    property['door timings'] = req.body['propertyTimings'];
    property['safety'] = req.body['propertySafety'];
    property['water type'] = req.body['propertyDrinkingWaterType'];
    property['hot water'] = req.body['propertyHotWater'];
    property['water supply'] = req.body['propertyWaterSupply'];
    property['deposit'] = req.body['propertyDeposit'];
    property['room cooling'] = req.body['propertyRoomCooling'];
    property['electricity'] = req.body['propertyElectricity'];
    property['seats'] = req.body['propertySeats'];
    property['rent'] = req.body['propertyRent'].split(',');
    property['video'] = req.body['propertyVideo'];
    property['area'] = req.body['propertyArea'];
    property['lift facility'] = req.body['propertyLiftFacility'];
    property.facing = req.body['propertyFacing'];
    property.bathrooms = req.body['propertyBathrooms'];
    property.furnished = req.body['propertyFurnished'];
    const result = await property.save();
    res.redirect(`/manage-property/${result._id}`);
  } catch (err) {
    return next(new Error(err));
  }
};

// ----------  Property Images  ----------
exports.getPropertyImages = async (req, res, next) => {
  const propId = req.params.propId;
  const property = await getPropertyInfo(propId, req.user);
  res.render('property/pg_images', {
    pageTitle: property.title,
    property,
  });
};

exports.getAddPropertyImagesCategory = async (req, res, next) => {
  const propId = req.params.propId;
  const userId = req.user._id;
  const category = req.query.category;
  if (!propId || !category) throw new Error('Property Not Found');
  const property = await Property.findOne(
    { _id: propId, userId },
    { pgImages: true }
  );
  if (!property) throw new Error('Property Not Found');
  res.render('property/category_image', {
    pageTitle: category,
    pgImages: property.pgImages[category],
    propId,
    category,
  });
};

exports.postAddPropertyImagesCategory = async (req, res, next) => {
  // return res.send({ body: req.body, files: req.files });
  const propId = req.body.propId;
  const category = req.body.category;
  const userId = req.user._id;
  if (!propId || !category) throw new Error('Property Not Found');
  const property = await Property.findOne(
    { _id: propId, userId },
    { pgImages: true, progress: true }
  );
  if (!property) throw new Error('Property Not Found');
  if (req.files['pg_images'] && req.files['pg_images'].length > 0) {
    const pgImageUrls = req.files['pg_images'].map((i) => i.path);
    if (property.pgImages[category].length === 0) {
      property.pgImages.defaults.push(pgImageUrls[0]);
      property.progress += 10;
    }

    pgImageUrls.forEach((i) => {
      property.pgImages[category].push(i);
    });
  }
  await property.save();
  return res.redirect(`add-property-images/${propId}?category=${category}`);
};

exports.deletePropertyImages = async (req, res, next) => {
  const propId = req.params.propId;
  const category = req.query.category;
  const idx = req.query.idx;
  const userId = req.user._id;
  const property = await Property.findOne({ _id: propId, userId });
  const imgPath = property.pgImages[category][idx];
  deleteFile(property.pgImages[category][idx]);
  const defaultIndex = property.pgImages.defaults.findIndex(
    (path) => path.toString() === imgPath.toString()
  );
  if (defaultIndex !== -1) {
    property.pgImages.defaults[defaultIndex] = property.pgImages[category][1];
  }
  property.pgImages[category].splice(idx, 1);
  await property.save();
  return res.redirect(`/add-property-images/${propId}?category=${category}`);
};

exports.deleteProperty = async (req, res, next) => {
  const propId = req.body.propId;
  const property = await Property.findById(propId).lean();
  if (!property) throw 'Property Not found';
  if (!req.user.isAdmin && property.userId.toString() !== req.user._id)
    throw 'Access Dennied';
  const result = await Property.deleteOne({ _id: propId });
  res.redirect('/manage-property');
};

exports.viewProperty = async (req, res, next) => {
  try {
    const propId = req.params.propId;
    const property = await Property.findById(propId).lean();
    res.render('property/view_property', {
      pageTitle: property['title'],
      property,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.getProperties = async (req, res, next) => {
  const properties = await Property.find({ userId: req.user._id });
  res.render('property/propertiesList', {
    pageTitle: 'Manage Property',
    properties,
  });
};

exports.manageProperty = async (req, res, next) => {
  const propId = req.params.propId;
  const property = await Property.findOne({
    _id: propId,
    userId: req.user._id,
  });
  if (!property) throw new Error('Property Not Found');
  res.render('property/manage_property', {
    pageTitle: 'Manage Property',
    propId,
  });
};

exports.setDefaultImg = async (req, res, next) => {
  const propId = req.params.propId;
};

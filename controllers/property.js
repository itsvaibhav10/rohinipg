const Property = require('../models/property');
const Master = require('../models/master');
const { deleteFile } = require('./utility');

exports.getAddProperty = async (req, res, next) => {
  const master = await Master.findOne().lean();
  res.render('property/add_property', { pageTitle: 'Add Property', master });
};

exports.postAddProperty = async (req, res, next) => {
  try {    
    const pgImageUrls = [];
    pgImageUrls.push(req.files['pg_image1'][0].path);
    pgImageUrls.push(req.files['pg_image2'][0].path);
    pgImageUrls.push(req.files['pg_image3'][0].path);
    pgImageUrls.push(req.files['pg_image4'][0].path);

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
      rent: req.body['propertyRent'],
      video: req.body['propertyVideo'],
      area: req.body['propertyArea'],
      pgImages: pgImageUrls,
    };
    
    const result = await Property.create(newProperty);
    res.redirect(`/property/${result._id}`);
  } catch (err) {
    return next(new Error(err));
  }
};

exports.getEditProperty = async (req, res, next) => {
  const propId = req.params.propId;
  let property;
  const master = await Master.findOne().lean();
  if (!req.user.isAdmin)
    property = await Property.findOne({
      userId: req.user._id,
      _id: propId,
    }).lean();
  else property = await Property.findById(propId).lean();
  if (!property) return res.redirect('/');
  res.render('property/edit_property', {
    pageTitle: 'Edit Property',
    property,
    master,
  });
};

exports.postEditProperty = async (req, res, next) => {
  try {
    const propId = req.body.propId;
    const oldproperty = await Property.findById(propId);
    if (!oldproperty) throw new Error('Property not Found');

    if (req.files['pg_image1']) {
      deleteFile(oldproperty.pgImages[0]);
      oldproperty.pgImages[0] = req.files['pg_image1'][0].path;
    }
    if (req.files['pg_image2']) {
      deleteFile(oldproperty.pgImages[1]);
      oldproperty.pgImages[1] = req.files['pg_image2'][0].path;
    }
    if (req.files['pg_image3']) {
     deleteFile(oldproperty.pgImages[2]);
     oldproperty.pgImages[2] = req.files['pg_image3'][0].path;
    }
    if (req.files['pg_image4']) {
     deleteFile(oldproperty.pgImages[3]);
     oldproperty.pgImages[3] = req.files['pg_image4'][0].path;
    }

    oldproperty['title'] = req.body['propertyTitle'];
    oldproperty['description'] = req.body['propertyDesc'];
    oldproperty['houseNo'] = req.body['propertyAddress1'];
    oldproperty['street'] = req.body['propertyAddress2'];
    oldproperty['city'] = req.body['propertyCity'];
    oldproperty['state'] = req.body['propertyState'];
    oldproperty['pincode'] = req.body['propertyPincode'];
    oldproperty['provider type'] = req.body['propertyProviderType'];
    oldproperty['availability'] = req.body['propertyAvailableFor'];
    oldproperty['occupancy'] = req.body['propertyOccupancy'];
    oldproperty['meals'] = req.body['propertyFood'];
    oldproperty['cable tv'] = req.body['propertyCable'];
    oldproperty['internet'] = req.body['propertyInternet'];
    oldproperty['table chair'] = req.body['propertyTable'];
    oldproperty['locker'] = req.body['propertyLocker'];
    oldproperty['bed type'] = req.body['propertyBedType'];
    oldproperty['parking'] = req.body['propertyParking'];
    oldproperty['laundry'] = req.body['propertyLaundry'];
    oldproperty['door timings'] = req.body['propertyTimings'];
    oldproperty['safety'] = req.body['propertySafety'];
    oldproperty['water type'] = req.body['propertyDrinkingWaterType'];
    oldproperty['hot water'] = req.body['propertyHotWater'];
    oldproperty['water supply'] = req.body['propertyWaterSupply'];
    oldproperty['deposit'] = req.body['propertyDeposit'];
    oldproperty['room cooling'] = req.body['propertyRoomCooling'];
    oldproperty['electricity'] = req.body['propertyElectricity'];
    oldproperty['seats'] = req.body['propertySeats'];
    oldproperty['rent'] = req.body['propertyRent'];
    oldproperty['video'] = req.body['propertyVideo'];
    oldproperty['area'] = req.body['propertyArea'];

    const result = await oldproperty.save();
    res.redirect(`/property/${result._id}`);
  } catch (err) {
    return next(new Error(err));
  }
};

exports.deleteProperty = async (req, res, next) => {
  const propId = req.body.propId;
  const property = await Property.findById(propId).lean();
  if (!property) throw 'Property Not found';
  if (!req.user.isAdmin && property.userId.toString() !== req.user._id)
    throw 'Access Dennied';
  const result = await Property.deleteOne({ _id: propId });
  console.log(result);
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

exports.manageProperty = async (req, res, next) => {
  const properties = await Property.find({ userId: req.user._id });
  res.render('property/manage_property', {
    pageTitle: 'Manage Property',
    properties,
  });
};


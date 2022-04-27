const Package = require('../models/package');

exports.getPackage = async (req, res, next) => {
  const packages = await Package.find({ isActive: true });
  res.render('home/packages', {
    pageTitle: `Packages`,
    packages
  });
};

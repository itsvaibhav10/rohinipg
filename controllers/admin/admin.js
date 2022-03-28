// ---------------   Models  ---------------
const Property = require('../../models/property');
const User = require('../../models/user');

// ---------------  Admin Home Routes  ---------------
exports.adminHome = async (req, res) => {
  try {
    res.render('admin/index', {
      path: '/admin/index',
      pageTitle: 'Admin Panel',
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEnquiry = async (req, res, next) => {};

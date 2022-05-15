// ---------------   Models  ---------------
const Property = require('../../models/property');
const User = require('../../models/user');

// ---------------  Admin Home Routes  ---------------
exports.adminHome = async (req, res) => {
  return res.redirect('/admin/enquiries');
  res.render('admin/index', {
    path: '/admin/index',
    pageTitle: 'Admin Panel',
  });
};

exports.getEnquiry = async (req, res, ) => {};

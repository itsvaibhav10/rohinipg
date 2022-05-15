const User = require('../models/user');

exports.profile = async (req, res) => {
  res.render('user/profile', { pageTitle: `${req.user.firstName} ${req.user.lastName}` });
};

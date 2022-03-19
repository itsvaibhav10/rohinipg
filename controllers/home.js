exports.index = (req, res, next) => {
  res.redirect('/home');
};
exports.home = (req, res, next) => {
  res.render('home/index', { pageTitle: 'Home' });
};

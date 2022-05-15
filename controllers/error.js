// ---------------   Page Not Found Error  ---------------
exports.get404 = (req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};

// ---------------   Logical Error  ---------------
exports.get500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    error: err,
    isAuthenticated: req.session.isLoggedIn,
  });
};

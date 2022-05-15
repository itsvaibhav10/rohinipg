exports.isNotAuth = (req, res, next) => {
  const url = req.session && req.session.url ? req.session.url : '/home';
  if (req.session.isLoggedIn) return res.redirect(url);
  next();
};

exports.isAuth = (req, res, next) => {
  req.session.url = req.url;
  if (!req.session.isLoggedIn) return res.redirect('/login');
  next();
};

exports.isProvider = () => {
  if (!req.user.typeOfUser.lowerCase() === 'provider')
    return res.redirect('/login');
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.redirect('/home');
  next();
};

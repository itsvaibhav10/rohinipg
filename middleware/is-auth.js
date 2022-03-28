exports.isNotAuth = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect('/home');
  next();
};

exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) return res.redirect('/login');
  next();
};

exports.isAuthAdmin = (req, res, next) => {
  if (!req.session.isLoggedIn) return res.redirect('/login');
  if (!req.user.isAdmin) return res.redirect('/home');
  next();
};

// const urlTracker = (url) => {
//   console.log(url);
//   let currUrl = '';
//   let prevUrl = '';
//   prevUrl = currUrl;
//   currUrl = url;
//   console.log('PrevUrl ' + prevUrl);
//   console.log('CurrUrl ' + currUrl);
// };

// ---------------   Models  ---------------
const User = require('../models/user');
const csrf = require('csurf');
const flash = require('connect-flash');

// ---------------   Routes Import  ---------------
const authRoutes = require('../routes/auth');
const errorController = require('../controllers/error');

module.exports = (app) => {
  // CSRF Protection
  app.use(csrf());
  app.use(flash());

  // Setup logged in User Globally
  app.use(async (req, res, next) => {
    try {
      if (!req.session.user) return next();
      let user = await User.findById(req.session.user._id);
      if (!user) return next();
      req.user = user;
      next();
    } catch (err) {
      next(new Error(err));
    }
  });

  // Passing Arguments to all Views
  app.use((req, res, next) => {
    try {
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      res.locals.user = req.user;
      next();
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });

  // Routes Set
  app.use(authRoutes);

  // Error Routes
  app.get('/500', errorController.get500);
  app.use(errorController.get404);

  // Error Controller
  app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      error: err,
      isAuthenticated: req.session ? req.session.isLoggedIn : false,
    });
  });
};

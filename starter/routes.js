// ---------------   Models  ---------------
const User = require('../models/user');
const csrf = require('csurf');
const flash = require('connect-flash');

// ---------------   Admin Routes Import  ---------------
const adminRoutes = require('../routes/admin/admin');
const adminEnquiryRoutes = require('../routes/admin/enquiry');
const adminMasterRoutes = require('../routes/admin/master');
const adminNotificaionRoutes = require('../routes/admin/notification');
const adminPackageRoutes = require('../routes/admin/package');
const adminPropertyRoutes = require('../routes/admin/property');
const adminUserRoutes = require('../routes/admin/user');

// ---------------   Routes Import  ---------------
const authRoutes = require('../routes/auth');
const propertyRoutes = require('../routes/property');
const roomRoutes = require('../routes/room');
const userRoutes = require('../routes/user');
const homeRoutes = require('../routes/home');
const errorController = require('../controllers/error');

module.exports = (app) => {
  // CSRF Protection
  app.use(csrf());
  app.use(flash());

  // Setup logged in User Globally
  app.use(async (req, res, next) => {
    if (!req.session.user) return next();
    let user = await User.findById(req.session.user._id);
    if (!user) return next();
    req.user = user;
    next();
  });

  // Passing Arguments to all Views
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.user = req.user;
    next();
  });

  // User Routes
  app.use(homeRoutes, authRoutes, propertyRoutes, roomRoutes, userRoutes);

  // Admin Routes
  app.use(
    '/admin',
    adminRoutes,
    adminEnquiryRoutes,
    adminMasterRoutes,
    adminNotificaionRoutes,
    adminPackageRoutes,
    adminPropertyRoutes,
    adminUserRoutes
  );

  // Error Routes
  app.use(errorController.get404);
  app.use(errorController.get500);
};

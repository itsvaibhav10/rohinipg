const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Connection String
const MONGODB_URI = process.env.mongoUri;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

module.exports = (app) => {
  // Templating Engine Set
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  // Secure Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(compression());
  // app.use(passport.initialize());
  // app.use(passport.session());

  // Session
  app.set('trust proxy', 1); // trust first proxy
  app.use(
    session({
      secret: 'BookReaderSecret',
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
};

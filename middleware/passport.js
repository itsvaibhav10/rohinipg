const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const Notification = require('../models/notification');

module.exports = function (req, res, next) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: profile.provider,
          emailVerify: true,
          doj: Date.now(),
          cart: { items: [] },
        });
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          const result = await Notification.create({ userId: user._id });
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });

  next();
};

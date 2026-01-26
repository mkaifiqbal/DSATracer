const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const MASTER_ADMIN = "your-email@gmail.com"; // Your actual email
    const email = profile.emails[0].value;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: email,
          profilePic: profile.photos[0].value,
          role: email === MASTER_ADMIN ? 'admin' : 'student' // Auto-promote admin
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Session handling
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});
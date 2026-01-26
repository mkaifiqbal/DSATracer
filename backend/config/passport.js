const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // FIX 1: Use absolute URL in production to force HTTPS matches Google Console
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://dsatracer.onrender.com/api/auth/google/callback' 
      : '/api/auth/google/callback',
    // FIX 2: Trust Render's proxy so it knows we are secure (https)
    proxy: true 
  },
  async (accessToken, refreshToken, profile, done) => {
    // You can also move this to .env if you want to change admins easily
    const MASTER_ADMIN = "mkaifiqbal786@gmail.com"; 
    const email = profile.emails[0].value;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: email,
          profilePic: profile.photos[0].value,
          role: email === MASTER_ADMIN ? 'admin' : 'student'
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
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://dsa-tracer.vercel.app/api/auth/google/callback' 
      : '/api/auth/google/callback',
    proxy: true 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user (Defaults to 'student')
        user = new User({
          name: profile.displayName,
          email: email,
          profilePic: profile.photos[0].value,
          role: 'student' // Default role for all new sign-ups
        });
        await user.save();
      }

      // If user existed, they are returned with their existing role (e.g., 'admin')
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));


// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // FIX: Send users to VERCEL (the frontend), not Render (the backend).
//     // This ensures the Login Cookie is saved on the correct website.
//     callbackURL: process.env.NODE_ENV === 'production' 
//       ? 'https://dsa-tracer.vercel.app/api/auth/google/callback' 
//       : '/api/auth/google/callback',
//     // callbackURL:'/api/auth/google/callback',
//     proxy: true 
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     // Your Admin Logic (Preserved)
//     const MASTER_ADMIN = "mkaifiqbal786@gmail.com"; 
//     const email = profile.emails[0].value;

//     try {
//       let user = await User.findOne({ email });
//       if (!user) {
//         user = new User({
//           name: profile.displayName,
//           email: email,
//           profilePic: profile.photos[0].value,
//           role: email === MASTER_ADMIN ? 'admin' : 'student'
//         });
//         await user.save();
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err, null);
//     }
//   }
// ));

// // Session handling
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => {
//   User.findById(id).then(user => done(null, user));
// });
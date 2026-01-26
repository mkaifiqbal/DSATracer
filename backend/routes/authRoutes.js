const express = require('express');
const passport = require('passport');
const router = express.Router();

// Use the Environment Variable we set in Render, or fallback to localhost
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Trigger Google Login
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

// Google Callback
router.get('/google/callback', 
  passport.authenticate('google', { 
      // Redirect to the correct frontend (Vercel or Local) on failure
      failureRedirect: CLIENT_URL
  }),
  (req, res) => {
    // Successful authentication, redirect to the correct frontend
    res.redirect(CLIENT_URL); 
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send(err);
    // Redirect to the correct frontend after logout
    res.redirect(CLIENT_URL);
  });
});

// Get Current User (Fixed: Explicitly returns null JSON to prevent crashes)
router.get('/current_user', (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    // This fixes the "Unexpected end of JSON input" error
    res.status(200).json(null); 
  }
});

module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Trigger Google Login
// Access via: http://localhost:5000/api/auth/google
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Optional: Forces account selection
}));

// Google Callback
// Access via: http://localhost:5000/api/auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { 
      // Change this to your frontend URL to avoid "Cannot GET /login" on failure
      failureRedirect: 'http://localhost:5173' 
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend dashboard
    res.redirect('http://localhost:5173'); 
  }
);

// Get Current User (Frontend calls this to check if logged in)
router.get('/current_user', (req, res) => {
  // If user is logged in, passport attaches it to req.user
  res.send(req.user || null);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send(err);
    res.redirect('http://localhost:5173');
  });
});

// backend/routes/authRoutes.js
router.get('/current_user', (req, res) => {
  if (req.user) {
    res.status(200).json(req.user); // Send user object if logged in
  } else {
    res.status(200).json(null); // Explicitly send null as JSON for Guests
  }
});
module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// Import the tracker middleware
const trackActivity = require('./middleware/trackActivity');

require('dotenv').config();
require('./config/passport'); // Handled by Google OAuth strategy

const app = express();

// 1. Unified CORS Configuration
// Allows credentials (cookies) to be sent between Frontend (5173) and Backend (5000)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "admin-email"]
}));

app.use(express.json());

// 2. Unified Session Configuration
// Must be defined BEFORE Passport session initialization
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_for_dsa_tracer',
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS in production
        maxAge: 24 * 60 * 60 * 1000 // 24 Hours
    }
}));

// 3. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// --- NEW: Activate Activity Tracker ---
// This must come AFTER passport.session() so 'req.user' is available
app.use(trackActivity);
// --------------------------------------

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('Connection Error:', err));

// 5. Registered Routes
// Ensure these match your file structure for VizNest and DSA Tracer projects
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
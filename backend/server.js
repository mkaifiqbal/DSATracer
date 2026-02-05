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

// Required for Render/Vercel to handle cookies correctly behind a proxy
app.set("trust proxy", 1);

// 1. Unified CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173"
        // ,                 // For Local Development
        // "https://dsa-tracer.vercel.app"          // For Vercel Production
    ],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "admin-email"]
}));

app.use(express.json());

// 2. Unified Session Configuration (FIXED FOR DEPLOYMENT)
// Must be defined BEFORE Passport session initialization
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_for_dsa_tracer',
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true,
        // FIX: Secure must be TRUE in production (HTTPS) but FALSE locally
        secure: process.env.NODE_ENV === "production", 
        // FIX: SameSite must be 'none' to allow Vercel to talk to Render
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
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
app.get('/', (req, res) => {
    res.send("API is running successfully...");
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
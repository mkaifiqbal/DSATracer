const User = require('../models/User');

const trackActivity = async (req, res, next) => {
    // We only track authenticated users
    if (req.user) {
        try {
            // Update the 'lastActiveAt' field to NOW
            await User.findByIdAndUpdate(req.user._id, { lastActiveAt: new Date() });
        } catch (err) {
            console.error("Tracking Error:", err);
        }
    }
    next(); // Continue to the actual route
};

module.exports = trackActivity;
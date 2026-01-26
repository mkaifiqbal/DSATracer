const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    // In a real production app, you would verify a JWT token here.
    // For now, we will use the email sent in headers for simplicity.
    const adminEmail = req.headers['admin-email'];

    if (!adminEmail) {
        return res.status(401).json({ message: "Unauthorized: No email provided" });
    }

    try {
        const user = await User.findOne({ email: adminEmail });
        if (user && user.role === 'admin') {
            next(); // User is admin, proceed to the route handler
        } else {
            res.status(403).json({ message: "Forbidden: Admin access required" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

module.exports = { isAdmin };
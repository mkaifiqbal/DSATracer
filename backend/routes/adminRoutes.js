const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
    const adminEmail = req.headers['admin-email'];
    
    try {
        // 1. DYNAMIC CHECK: Look up the user by email in the database
        const requestingUser = await User.findOne({ email: adminEmail });

        // 2. VERIFY: Does the user exist AND is their role "admin"?
        if (!requestingUser || requestingUser.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access required." });
        }

        // 3. If they are an admin, proceed with gathering stats
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        const [classworkCount, practiceCount, activeUsersCount, allUsers] = await Promise.all([
            Question.countDocuments({ isPractice: false }),
            Question.countDocuments({ isPractice: true }),
            User.countDocuments({ lastActiveAt: { $gte: fifteenMinutesAgo } }),
            User.find({}, 'name email role lastActiveAt profilePic').sort({ lastActiveAt: -1 })
        ]);
        
        res.json({
            classworkCount,
            practiceCount,
            activeUsers: activeUsersCount,
            userDetails: allUsers 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
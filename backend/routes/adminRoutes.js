const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
    const adminEmail = req.headers['admin-email'];
    
    // Verification using your master email
    if (adminEmail !== "mkaifiqbal786@gmail.com") {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        // 1. Calculate the timestamp for "15 minutes ago"
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        // 2. Run all database queries in parallel for better performance
        const [classworkCount, practiceCount, activeUsersCount, allUsers] = await Promise.all([
            // Count Classwork
            Question.countDocuments({ isPractice: false }),
            
            // Count Practice
            Question.countDocuments({ isPractice: true }),
            
            // Count ONLY users who were active in the last 15 minutes
            User.countDocuments({ lastActiveAt: { $gte: fifteenMinutesAgo } }),
            
            // Get ALL users, but sort them by 'lastActiveAt' (newest first)
            // This lets you see the active ones at the top of your list
            User.find({}, 'name email role lastActiveAt').sort({ lastActiveAt: -1 })
        ]);
        
        res.json({
            classworkCount,
            practiceCount,
            activeUsers: activeUsersCount, // This now shows REAL online users
            userDetails: allUsers          // Full member list, sorted by activity
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
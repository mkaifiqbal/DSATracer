const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
    const adminEmail = req.headers['admin-email'];
    
    // Hardcoded check: This acts as your security gatekeeper
    if (adminEmail !== "mkaifiqbal786@gmail.com") {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        const [classworkCount, practiceCount, activeUsersCount, allUsers] = await Promise.all([
            Question.countDocuments({ isPractice: false }),
            Question.countDocuments({ isPractice: true }),
            User.countDocuments({ lastActiveAt: { $gte: fifteenMinutesAgo } }),
            
            // UPDATED: Added 'profilePic' to the selection string
            User.find({}, 'name email role lastActiveAt profilePic').sort({ lastActiveAt: -1 })
        ]);
        
        res.json({
            classworkCount,
            practiceCount,
            activeUsers: activeUsersCount,
            userDetails: allUsers // Now includes the profilePic field
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   POST /api/users/auth
 * @desc    Find or Create User during login
 */
router.post('/auth', async (req, res) => {
    const { email, name, profilePic } = req.body;
    try {
        let user = await User.findOne({ email });
        
        if (!user) {
            // Define your master admin email here
            const isMasterAdmin = email === "mkaifiqbal786@gmail.com"; 

            user = new User({ 
                name, 
                email, 
                profilePic, 
                completedQuestions: [],
                role: isMasterAdmin ? 'admin' : 'student'
            });
            await user.save();
        }
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Auth Error", error: err.message });
    }
});

/**
 * @route   PUT /api/users/toggle-question
 * @desc    Check/Uncheck a DSA question for a specific user
 * @update  Fixed: Uses $addToSet/$pull to handle ObjectId vs String comparison correctly
 */
router.put('/toggle-question', async (req, res) => {
    const { email, questionId } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 1. Check if the questionId exists in the array (convert to string to be safe)
        const isCompleted = user.completedQuestions.some(id => id.toString() === questionId);

        let updatedUser;

        if (isCompleted) {
            // 2. If exists, PULL (remove) it
            updatedUser = await User.findOneAndUpdate(
                { email },
                { $pull: { completedQuestions: questionId } },
                { new: true } // Return updated doc
            );
        } else {
            // 3. If not exists, ADD to SET (avoids duplicates)
            updatedUser = await User.findOneAndUpdate(
                { email },
                { $addToSet: { completedQuestions: questionId } },
                { new: true }
            );
        }

        res.status(200).json(updatedUser.completedQuestions);
    } catch (err) {
        res.status(500).json({ message: "Update Error", error: err.message });
    }
});

/**
 * @route   PUT /api/users/update-name
 * @desc    Update user display name with auto-save support
 */
router.put('/update-name', async (req, res) => {
    const { email, name } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $set: { name: name } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Database Error", error: err.message });
    }
});

module.exports = router;
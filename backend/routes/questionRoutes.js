const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// --- INLINE ADMIN CHECK (Simpler & Safer for now) ---
const isAdmin = (req, res, next) => {
    // Check Session OR Header (Fallback)
    if (req.isAuthenticated && req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    // Fallback: Check the header if session fails
    const adminEmail = req.headers['admin-email'];
    if (adminEmail === "mkaifiqbal786@gmail.com") {
        return next();
    }
    
    return res.status(403).json({ message: "Access Denied: You are not an Admin" });
};

// GET all questions (Public)
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new question (Protected)
router.post('/', isAdmin, async (req, res) => {
    const { title, topic, link, ansLink, dateTaught, isPractice } = req.body;

    const question = new Question({
        title,
        topic,
        link,
        ansLink,
        dateTaught: isPractice ? null : dateTaught,
        isPractice
    });

    try {
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a question (Protected)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });
        res.json({ message: "Question deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE a question (Protected)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Question not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
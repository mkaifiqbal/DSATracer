const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    completedQuestions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question' 
    }],
    role: { type: String, default: 'student' },
    profilePic: { type: String },
    
    theme: { type: String, default: 'light' },
    lastActiveAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
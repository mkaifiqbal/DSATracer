const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    topic: { 
        type: String, 
        required: true 
    },
    // --- CHANGE 'url' TO 'link' ---
    link: { 
        type: String, 
        required: true 
    },
    // ------------------------------
    ansLink: { 
        type: String, 
        required: false 
    },
    dateTaught: { 
        type: Date 
    },
    isPractice: { 
        type: Boolean, 
        default: false 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    completedQuestions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question' 
    }]
});

module.exports = mongoose.model('Question', QuestionSchema);
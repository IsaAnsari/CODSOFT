const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [String], // Array of strings for multiple-choice options
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length >= 2; // At least 2 options
            },
            message: 'A question must have at least two options!'
        }
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function (v) {
                return v < this.options.length; // Correct index must be within options range
            },
            message: 'Correct answer index is out of bounds for the given options.'
        }
    },
}, { _id: false }); // Do not create a separate _id for sub-documents

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    questions: {
        type: [questionSchema], // Array of questionSchema
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0; // Quiz must have at least one question
            },
            message: 'A quiz must have at least one question.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'quizzes' }); // Explicitly set collection name

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
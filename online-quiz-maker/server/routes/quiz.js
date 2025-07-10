const express = require('express');
const Quiz = require('../models/Quiz'); // Import the Quiz model
const auth = require('../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
    const { title, description, questions } = req.body;

    try {
        const newQuiz = new Quiz({
            title,
            description,
            questions,
            createdBy: req.user.id, // Get user ID from the authenticated request
        });

        const quiz = await newQuiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error(err.message);
        // Mongoose validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find quizzes and populate the 'createdBy' field to get username/email
        const quizzes = await Quiz.find().populate('createdBy', ['username', 'email']);
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('createdBy', ['username', 'email']);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        // Handle CastError for invalid ID format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz by ID
// @access  Private (requires authentication, only creator can update)
router.put('/:id', auth, async (req, res) => {
    const { title, description, questions } = req.body;

    try {
        let quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user owns the quiz
        if (quiz.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Update fields
        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.questions = questions || quiz.questions; // Be careful with partial updates to questions array

        quiz = await quiz.save();
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz by ID
// @access  Private (requires authentication, only creator can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user owns the quiz
        if (quiz.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Quiz.deleteOne({ _id: req.params.id }); // Use deleteOne or findByIdAndDelete
        res.json({ message: 'Quiz removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
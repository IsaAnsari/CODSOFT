require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000

// Middleware
app.use(express.json()); // Allows the app to use JSON body in requests
app.use(cors()); // Enable CORS for all routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Exit process with failure
        process.exit(1);
    });

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Quiz Maker Backend is Running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Import the Job model

// Route 1: Get all jobs
// GET /api/jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 }); // Get all jobs, sorted by most recent
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err.message);
        res.status(500).send('Server Error');
    }
});

// Route 2: Add a new job
// POST /api/jobs
router.post('/', async (req, res) => {
    const { title, company, location, description, type, salary, requirements } = req.body;

    // Basic validation (can be enhanced)
    if (!title || !company || !location || !description || !type) {
        return res.status(400).json({ msg: 'Please enter all required fields: title, company, location, description, type' });
    }

    try {
        const newJob = new Job({
            title,
            company,
            location,
            description,
            type,
            salary,
            requirements
        });

        const job = await newJob.save(); // Save the new job to the database
        res.status(201).json(job); // Respond with the created job
    } catch (err) {
        console.error('Error adding job:', err.message);
        // Check for Mongoose validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// You can add more routes here later (e.g., get job by ID, update job, delete job)

module.exports = router;
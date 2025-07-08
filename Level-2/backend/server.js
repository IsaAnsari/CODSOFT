const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; // Use the environment variable
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Job Schema and Model
const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    description: String,
    type: String,
    salary: String,
    requirements: [String],
    postedAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// API Routes

// GET all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 }); // Sort by newest first
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET a single job by ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        // Handle invalid ID format (e.g., if ID is not a valid MongoDB ObjectId)
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Job ID' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST a new job
app.post('/api/jobs', async (req, res) => {
    const { title, company, location, description, type, salary, requirements } = req.body;

    if (!title || !company || !location || !description) {
        return res.status(400).json({ msg: 'Please enter all required fields' });
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

        const savedJob = await newJob.save();
        res.json(savedJob);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// NEW: PUT/UPDATE a job by ID
app.put('/api/jobs/:id', async (req, res) => {
    const { title, company, location, description, type, salary, requirements } = req.body;

    // Optional: Basic validation for required fields
    if (!title || !company || !location || !description) {
        return res.status(400).json({ msg: 'Please enter all required fields for update' });
    }

    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { title, company, location, description, type, salary, requirements, postedAt: Date.now() }, // Update all fields, refresh postedAt
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        if (!updatedJob) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(updatedJob);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Job ID' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});


// DELETE a job by ID
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        await Job.deleteOne({ _id: req.params.id }); // Use deleteOne with filter
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
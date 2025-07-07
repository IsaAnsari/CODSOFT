const mongoose = require('mongoose');

// Define the schema for a Job
const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: { // e.g., Full-time, Part-time, Contract, Internship
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'], // Restrict to these values
        default: 'Full-time'
    },
    salary: {
        type: String, // Storing as string to allow flexible inputs like "80k-100k", "Negotiable"
        trim: true,
        default: 'Negotiable'
    },
    requirements: {
        type: [String], // Array of strings for skills, qualifications
        default: []
    },
    postedAt: {
        type: Date,
        default: Date.now // Automatically sets the current date/time when a job is created
    }
});

// Create the Job model from the schema
const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
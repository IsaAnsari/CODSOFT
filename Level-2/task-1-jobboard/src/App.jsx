// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

import Home from './components/Home'; // Your updated Home component
import JobsPage from './components/JobsPage'; // Your updated JobsPage component
import AddJobPage from './components/AddJobPage';
import JobDetailPage from './components/JobDetailPage';
import EditJobPage from './components/EditJobPage';
import NotFoundPage from './components/NotFoundPage'; // Ensure you have this component, or use inline HTML

// --- NEW IMPORTS ---
import EmployersPage from './components/EmployersPage';
import ContactPage from './components/ContactPage';
// --- END NEW IMPORTS ---

import './App.css'; // Your main application CSS

function App() {
    // Functions to interact with your backend API
    const addJob = async (newJob) => {
        try {
            const res = await axios.post('http://localhost:5000/api/jobs', newJob);
            console.log('Job added:', res.data);
            return res.data; // Return added job data if needed
        } catch (error) {
            console.error('Error adding job:', error.response ? error.response.data : error.message);
            throw error; // Propagate error
        }
    };

    const updateJob = async (jobId, updatedJob) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/jobs/${jobId}`, updatedJob);
            console.log('Job updated:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error updating job:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
            console.log(`Job with ID ${jobId} deleted successfully.`);
            // No need to update App state here as JobsPage/JobDetailPage will re-fetch or manage
        } catch (error) {
            console.error('Error deleting job:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    return (
        <Router>
            <div className="app-container">
                <ToastContainer /> {/* Toast notifications will appear here */}
                <header className="app-header">
                    <h1>FlowJobs: Find Your Next Opportunity</h1>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/jobs">Job Listings</Link></li>
                            <li><Link to="/post-job">Post a Job</Link></li>
                            {/* --- UPDATED NAVIGATION LINKS --- */}
                            <li><Link to="/employers">For Employers</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            {/* --- END UPDATED NAVIGATION LINKS --- */}
                        </ul>
                    </nav>
                </header>

                <Routes>
                    {/* Home page: Shows hero and featured jobs */}
                    <Route path="/" element={<Home />} />

                    {/* All Job Listings page: Shows all jobs with search functionality */}
                    <Route path="/jobs" element={<JobsPage deleteJob={deleteJob} />} />

                    {/* Post a New Job page */}
                    <Route path="/post-job" element={<AddJobPage addJobSubmit={addJob} />} />

                    {/* Individual Job Details page */}
                    <Route path="/jobs/:id" element={<JobDetailPage deleteJob={deleteJob} />} />

                    {/* Edit Job page */}
                    <Route path="/jobs/:id/edit" element={<EditJobPage updateJobSubmit={updateJob} />} />

                    {/* --- NEW ROUTES --- */}
                    <Route path="/employers" element={<EmployersPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    {/* --- END NEW ROUTES --- */}

                    {/* 404 Not Found Page */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>

                <footer className="app-footer">
                    <p>© 2025 FlowJobs. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
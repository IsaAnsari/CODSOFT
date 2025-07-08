// src/components/JobsPage.jsx
import React, { useState, useEffect } from 'react';
import JobCard from './JobCard'; // <<< Make sure this path is correct
import axios from 'axios'; // <<< Make sure axios is imported
import { toast } from 'react-toastify'; // For notifications

const JobsPage = ({ deleteJob }) => {
    const [jobs, setJobs] = useState([]); // <<< State to hold all jobs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://codsoft-n1pn.onrender.com/api/jobs'); // Fetch ALL jobs
            if (response.status !== 200) {
                throw new Error('Failed to fetch all jobs');
            }
            setJobs(response.data); // <<< Set all jobs to state
        } catch (err) {
            console.error('Error fetching all jobs:', err);
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllJobs();
    }, []);

    const handleDeleteJobClick = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await deleteJob(jobId);
                setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
                toast.success('Job deleted successfully!');
            } catch (err) {
                console.error('Error deleting job:', err);
                toast.error('Failed to delete job. Please try again.');
            }
        }
    };

    const filteredJobs = jobs.filter(job => // <<< Filter from 'jobs' state
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.requirements && job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (loading) {
        return <p className="loading-message">Loading jobs...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <section className="job-listings-section">
            <h2 className="text-center my-6">All Job Listings</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="job-listings">
                {filteredJobs.length === 0 ? (
                    <p className="no-jobs-found">No jobs found matching your search criteria.</p>
                ) : (
                    // >>> Make sure you are mapping over filteredJobs
                    filteredJobs.map(job => (
                        <JobCard key={job._id} job={job} handleDelete={handleDeleteJobClick} /> // <<< Pass 'job' and handleDelete
                    ))
                )}
            </div>
        </section>
    );
};

export default JobsPage;
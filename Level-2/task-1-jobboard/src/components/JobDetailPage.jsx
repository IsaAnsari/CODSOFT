// src/components/JobDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const JobDetailPage = ({ deleteJob }) => { // Receive deleteJob prop
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://codsoft-n1pn.onrender.com/api/jobs/${id}`);
                if (res.status !== 200) {
                    throw new Error('Failed to fetch job details');
                }
                setJob(res.data);
            } catch (err) {
                console.error('Error fetching job details:', err);
                setError('Failed to load job details. Please try again later.');
                toast.error('Failed to load job details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleDeleteClick = async () => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await deleteJob(id); // Use the deleteJob prop
                toast.success('Job deleted successfully!');
                navigate('/jobs'); // Navigate back to all jobs after deletion
            } catch (err) {
                console.error('Error deleting job:', err);
                toast.error('Failed to delete job.');
            }
        }
    };

    if (loading) {
        return <p className="loading-message">Loading job details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!job) {
        return <p className="no-job-found">Job not found.</p>;
    }

    return (
        <section className="job-detail-section">
            <h2 className="text-center my-6">{job.title}</h2>
            <div className="job-detail-card">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.type}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Description:</strong> {job.description}</p>
                {job.requirements && job.requirements.length > 0 && (
                    <p><strong>Requirements:</strong> {job.requirements.join(', ')}</p>
                )}
                <p className="posted-date">Posted: {new Date(job.datePosted).toLocaleDateString()}</p>
                <div className="job-detail-actions">
                    <Link to="/jobs" className="back-button">Back to Job Listings</Link>
                    <Link to={`/jobs/${job._id}/edit`} className="edit-button">Edit Job</Link>
                    <button className="delete-button" onClick={handleDeleteClick}>Delete Job</button> {/* Delete button on detail page */}
                </div>
            </div>
        </section>
    );
};

export default JobDetailPage;
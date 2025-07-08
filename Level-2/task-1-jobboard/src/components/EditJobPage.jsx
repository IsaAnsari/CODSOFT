// src/components/EditJobPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditJobPage = ({ updateJobSubmit }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null); // To store original job data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Full-time');
    const [salary, setSalary] = useState('');
    const [requirements, setRequirements] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://codsoft-n1pn.onrender.com/api/jobs/${id}`);
                if (res.status !== 200) {
                    throw new Error('Failed to fetch job for editing');
                }
                const fetchedJob = res.data;
                setJob(fetchedJob); // Store original job
                // Set form fields with fetched data
                setTitle(fetchedJob.title || '');
                setCompany(fetchedJob.company || '');
                setLocation(fetchedJob.location || '');
                setDescription(fetchedJob.description || '');
                setType(fetchedJob.type || 'Full-time');
                setSalary(fetchedJob.salary || '');
                setRequirements(fetchedJob.requirements ? fetchedJob.requirements.join(', ') : '');
            } catch (err) {
                console.error('Error fetching job for edit:', err);
                setError('Failed to load job for editing.');
                toast.error('Failed to load job for editing.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedJob = {
            title,
            company,
            location,
            description,
            type,
            salary,
            requirements: requirements.split(',').map(req => req.trim()).filter(req => req !== ''),
        };

        try {
            await updateJobSubmit(id, updatedJob); // Call the prop function
            toast.success('Job Updated Successfully!');
            navigate(`/jobs/${id}`); // Navigate back to job details page
        } catch (error) {
            console.error("Error updating job:", error);
            toast.error('Failed to update job. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(`/jobs/${id}`); // Navigate back to job details page
    };

    if (loading) {
        return <p className="loading-message">Loading job for editing...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!job) {
        return <p className="no-job-found">Job not found for editing.</p>;
    }

    return (
        <section className="edit-job-section">
            <h2 className="text-center my-6">Edit Job: {job.title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="edit-title">Job Title:</label>
                    <input type="text" id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="edit-company">Company Name:</label>
                    <input type="text" id="edit-company" value={company} onChange={(e) => setCompany(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="edit-location">Location:</label>
                    <input type="text" id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="edit-description">Description:</label>
                    <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="5"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="edit-type">Job Type:</label>
                    <select id="edit-type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="edit-salary">Salary (e.g., "80k-100k", "Negotiable"):</label>
                    <input type="text" id="edit-salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="edit-requirements">Requirements (comma-separated):</label>
                    <input type="text" id="edit-requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                </div>
                <button type="submit" className="post-job-button">Update Job</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            </form>
        </section>
    );
};

export default EditJobPage;
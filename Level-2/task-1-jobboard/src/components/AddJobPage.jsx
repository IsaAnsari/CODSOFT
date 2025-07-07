// src/components/AddJobPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast for notifications

const AddJobPage = ({ addJobSubmit }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Full-time');
    const [salary, setSalary] = useState('');
    const [requirements, setRequirements] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newJob = {
            title,
            company,
            location,
            description,
            type,
            salary,
            requirements: requirements.split(',').map(req => req.trim()).filter(req => req !== ''),
            datePosted: new Date().toISOString().split('T')[0], // Current date
        };

        try {
            await addJobSubmit(newJob); // Call the prop function to send to App.jsx -> API
            navigate('/jobs'); // Navigate to the all job listings page on success
            toast.success('Job Added Successfully!'); // Show success notification
        } catch (error) {
            console.error("Error submitting job:", error);
            toast.error('Failed to add job. Please try again.'); // Show error notification
        }
    };

    const handleCancel = () => {
        navigate('/jobs'); // Navigate back to the all job listings page
        // Or navigate('/'); if you want to go back to the homepage
    };

    return (
        <section className="add-job-section">
            <h2 className="text-center my-6">Post a New Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Job Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company Name:</label>
                    <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="5"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="type">Job Type:</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary (e.g., "80k-100k", "Negotiable"):</label>
                    <input type="text" id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="requirements">Requirements (comma-separated):</label>
                    <input type="text" id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                </div>
                <button type="submit" className="post-job-button">Post Job</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            </form>
        </section>
    );
};

export default AddJobPage;
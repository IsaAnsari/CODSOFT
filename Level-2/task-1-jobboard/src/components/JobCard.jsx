// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, handleDelete }) => { // Make sure 'job' and 'handleDelete' are props
    // Make sure 'job' properties (job.title, job.company, etc.) are used here
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p><strong>{job.company}</strong> - {job.type}</p>
            <p>{job.location}</p>
            <p className="job-description-preview">
                {job.description && job.description.length > 150 // Check if description exists
                    ? job.description.substring(0, 150) + '...'
                    : job.description}
            </p>
            <p>Salary: {job.salary}</p>
            {job.requirements && job.requirements.length > 0 && (
                <p>Requirements: {job.requirements.join(', ')}</p>
            )}
            <div className="job-card-actions">
                <Link to={`/jobs/${job._id}`} className="apply-button">View Details</Link>
                {handleDelete && (
                    <button
                        className="delete-button"
                        onClick={() => handleDelete(job._id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
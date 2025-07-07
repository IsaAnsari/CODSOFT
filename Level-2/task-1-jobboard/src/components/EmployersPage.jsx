// src/components/EmployersPage.jsx
import React from 'react';

const EmployersPage = () => {
    return (
        <section className="static-page-section"> {/* Use a common class for these pages */}
            <h2>For Employers</h2>
            <p>Are you an employer looking to find the best talent? FlowJobs makes it easy to post job openings and connect with qualified candidates.</p>
            <p>Our platform offers:</p>
            <ul>
                <li>Easy job posting and management</li>
                <li>Access to a diverse pool of skilled professionals</li>
                <li>Advanced search and filtering options</li>
                <li>Dedicated support for all your hiring needs</li>
            </ul>
            <p>Ready to get started? <a href="/post-job">Post a Job now!</a></p>
            {/* You can add more content, forms, or calls to action here */}
        </section>
    );
};

export default EmployersPage;
// src/components/ContactPage.jsx
import React from 'react';

const ContactPage = () => {
    return (
        <section className="static-page-section"> {/* Use the same common class */}
            <h2>Contact Us</h2>
            <p>Have questions, feedback, or need assistance? Reach out to us!</p>
            <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:support@flowjobs.com">support@flowjobs.com</a></p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Job Seeker Lane, Talent City, India</p>
            </div>
            <p>We typically respond within 24-48 hours.</p>
            {/* You could add a contact form here */}
        </section>
    );
};

export default ContactPage;
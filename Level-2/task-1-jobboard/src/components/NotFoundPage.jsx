// src/components/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <section className="text-center my-auto" style={{ padding: '50px', fontSize: '1.5em' }}>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="explore-button" style={{ marginTop: '20px' }}>Go Home</Link>
        </section>
    );
};

export default NotFoundPage;
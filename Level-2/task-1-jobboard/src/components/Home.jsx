// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from './JobCard'; // <<< Make sure this path is correct
import axios from 'axios'; // <<< Make sure axios is imported

const Home = () => {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                setLoading(true);
                // Ensure this API call is correct and returns data.
                // Your image_8c604e.png shows data from /api/jobs, so this should work.
                const res = await axios.get('http://localhost:5000/api/jobs'); // Fetch all jobs
                if (res.status !== 200) {
                    throw new Error('Failed to fetch featured jobs');
                }
                // Take a slice for featured jobs, e.g., the first 4
                setFeaturedJobs(res.data.slice(0, 4)); // <<< This is important: take a slice!
            } catch (err) {
                console.error('Error fetching featured jobs:', err);
                setError('Failed to load featured jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedJobs();
    }, []);

    return (
        <>
            <section className="hero-section">
                <h2>Discover Your Dream Job. Effortlessly.</h2>
                <p>Connecting talented professionals with leading companies worldwide.</p>
                <Link to="/jobs" className="explore-button">Explore Jobs</Link>
            </section>

            <section className="featured-listings-section">
                <h2>Featured Job Listings</h2>
                {/* Search bar is intentionally removed from Home.jsx */}
                {loading ? (
                    <p className="loading-message">Loading featured jobs...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="job-listings">
                        {/* Ensure filteredJobs is not used here, it's featuredJobs */}
                        {featuredJobs.length === 0 ? (
                            <p>No featured jobs available at the moment.</p>
                        ) : (
                            // >>> Make sure you are mapping over featuredJobs
                            featuredJobs.map(job => (
                                <JobCard key={job._id} job={job} /> // <<< Pass the 'job' prop
                            ))
                        )}
                    </div>
                )}
            </section>
        </>
    );
};

export default Home;
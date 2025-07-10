import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ensure this path is correct

const Navbar = () => {
    const { user, logout, loading } = useAuth();

    // Basic inline style for the main nav element (similar to your initial observation)
    const navStyle = {
        backgroundColor: '#333', // Dark background for the navbar
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem', // Padding around the content
        flexWrap: 'wrap', // Allow wrapping on smaller screens
    };

    // Inline style for the brand (Quiz Maker)
    const brandStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
        marginRight: 'auto', // Pushes brand to left, links to right
        whiteSpace: 'nowrap',
    };

    // Inline style for the container of navigation links
    const navLinksContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem', // Space between links
        flexWrap: 'wrap',
    };

    // Inline style for individual links
    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
        whiteSpace: 'nowrap',
    };

    // Inline style for the logout button
    const logoutButtonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545', // Red background
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease',
        whiteSpace: 'nowrap',
    };

    // Show a basic Navbar while user data is loading
    if (loading) {
        return (
            <nav style={navStyle}>
                <Link to="/" style={brandStyle}>Quiz Maker</Link>
                <div style={navLinksContainerStyle}>
                    <Link to="/quizzes" style={linkStyle}>Quizzes</Link>
                    <span style={linkStyle}>Loading...</span>
                </div>
            </nav>
        );
    }

    return (
        <nav style={navStyle}>
            <Link to="/" style={brandStyle}>Quiz Maker</Link>
            <div style={navLinksContainerStyle}>
                <Link to="/quizzes" style={linkStyle}>Quizzes</Link>
                {user ? (
                    <>
                        <Link to="/create-quiz" style={linkStyle}>Create Quiz</Link>
                        <span style={linkStyle}>Hello, {user.username || 'User'}!</span>
                        <button onClick={logout} style={logoutButtonStyle}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register" style={linkStyle}>Register</Link>
                        <Link to="/login" style={linkStyle}>Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
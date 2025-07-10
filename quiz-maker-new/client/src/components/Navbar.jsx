import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth

const Navbar = () => {
    const { user, logout } = useAuth(); // Get user and logout from AuthContext

    return (
        <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>Quiz Maker</Link>
            <div>
                <Link to="/quizzes" style={{ color: '#fff', textDecoration: 'none', marginLeft: '1rem' }}>Quizzes</Link>
                {user ? ( // If user is logged in
                    <>
                        <Link to="/create-quiz" style={{ color: '#fff', textDecoration: 'none', marginLeft: '1rem' }}>Create Quiz</Link>
                        <span style={{ color: '#fff', marginLeft: '1rem' }}>Hello, {user.username || 'User'}!</span> {/* Display username    */}
                        <button onClick={logout} style={{ ...buttonStyle, marginLeft: '1rem' }}>Logout</button>
                    </>
                ) : ( // If user is NOT logged in
                    <>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none', marginLeft: '1rem' }}>Register</Link>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginLeft: '1rem' }}>Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// Simple button style for logout
const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545', // Red color for logout
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
};

export default Navbar;
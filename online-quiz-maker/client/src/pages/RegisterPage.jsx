import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // To display success/error messages
    const { register } = useAuth(); // Get the register function from context
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setMessage(''); // Clear previous messages

        // Basic validation (can be enhanced)
        if (!username || !email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        const result = await register(username, email, password); // Call register from context

        if (result.success) {
            setMessage(result.message || 'Registration successful!');
            navigate('/quizzes'); // Redirect to quizzes page after successful registration
        } else {
            setMessage(result.message || 'Registration failed. Please try again.');
        }
    };

    return (
        // <div className="form-container">
        <div style={formContainerStyle}>
            <h2>Register Account</h2>
            {message && <p style={messageStyle(message.includes('successful'))}>{message}</p>}
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={formGroupStyle}>
                    <label htmlFor="username" style={labelStyle}>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="password" style={labelStyle}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Register</button>
            </form>
        </div>
    );
};

// Basic inline styles for the form (you can move this to App.css or a dedicated CSS file)
const formContainerStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const labelStyle = {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333',
};

const inputStyle = {
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
};

const buttonStyle = {
    padding: '1rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
};

const messageStyle = (isSuccess) => ({
    padding: '0.8rem',
    borderRadius: '4px',
    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
    color: isSuccess ? '#155724' : '#721c24',
    border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`,
    marginBottom: '1rem',
    textAlign: 'center',
});

export default RegisterPage;
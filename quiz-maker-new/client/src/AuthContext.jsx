import React, { createContext, useState, useEffect, useContext } from 'react';
import API from './api'; // Import the configured Axios instance

// Create the Auth Context
const AuthContext = createContext(null);

// Create a custom hook to use the Auth Context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user info (e.g., { id, username, email })
    const [token, setToken] = useState(localStorage.getItem('token')); // Get token from localStorage
    const [loading, setLoading] = useState(true); // To manage initial loading state

    // useEffect to potentially validate token on app load (optional, but good practice)
    // For now, we'll keep it simple and just set loading to false.
    // In a more complex app, you'd have a /api/auth/me or similar route
    // to verify the token and fetch user data on app initialization.
    useEffect(() => {
        // No need to set axios.defaults.headers.common here anymore
        // as API.interceptors.request handles it for every call using `API` instance.
        setLoading(false);
    }, []); // Empty dependency array means this runs once on mount

    // Login function
    const login = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password }); // Use API.post
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            // In a real app, you might decode the token here or fetch user profile based on the token
            // For now, we'll just set a dummy user if login is successful.
            // The actual user info can be retrieved from a protected /api/auth/me route if implemented.
            setUser({ id: 'dummyUserId', username: 'loggedInUser' }); // Replace with actual user info later
            return { success: true, message: res.data.message };
        } catch (err) {
            console.error('Login error:', err.response?.data?.message || err.message);
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    // Register function
    const register = async (username, email, password) => {
        try {
            const res = await API.post('/auth/register', { username, email, password }); // Use API.post
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setUser({ id: 'dummyUserId', username: username }); // Set user after successful registration
            return { success: true, message: res.data.message };
        } catch (err) {
            console.error('Register error:', err.response?.data?.message || err.message);
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        // No need to delete axios.defaults.headers.common['x-auth-token'] here either
        // as API.interceptors will just see that localStorage.getItem('token') is null.
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Only render children after initial loading */}
        </AuthContext.Provider>
    );
};
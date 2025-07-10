import React, { createContext, useState, useEffect, useContext } from 'react';
import API from './api'; // Import your configured Axios instance

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

    // Function to load user data from backend using the token
    const loadUser = async () => {
        if (token) {
            try {
                // API interceptor handles the 'x-auth-token' header automatically via 'api.js'
                const res = await API.get('/auth'); // Make GET request to /api/auth
                setUser(res.data); // Set user state with actual user data from backend
            } catch (err) {
                console.error('Error loading user:', err);
                // If token is invalid or expired, clear it
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false); // Set loading to false after attempt
            }
        } else {
            setLoading(false); // No token, so not loading user
            setUser(null);
        }
    };

    // Effect to load user on initial mount or when token changes
    useEffect(() => {
        loadUser();
    }, [token]); // Re-run when token state changes

    // Login function
    const login = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token); // Ensure token is in localStorage
            await loadUser(); // Load actual user data immediately after login
            return { success: true, message: res.data.message }; // Return success and message
        } catch (err) {
            console.error('Login error:', err.response?.data?.message || err.message);
            return { success: false, message: err.response?.data?.message || 'Login failed' }; // Return failure and message
        }
    };

    // Register function
    const register = async (username, email, password) => {
        try {
            const res = await API.post('/auth/register', { username, email, password });
            setToken(res.data.token); // Registration also returns a token, so set it
            localStorage.setItem('token', res.data.token);
            await loadUser(); // Load actual user data immediately after registration
            return { success: true, message: res.data.message }; // Return success and message
        } catch (err) {
            console.error('Register error:', err.response?.data?.message || err.message);
            return { success: false, message: err.response?.data?.message || 'Registration failed' }; // Return failure and message
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        // API interceptor will handle removal of token from headers automatically
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
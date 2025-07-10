import axios from 'axios';

// Create an Axios instance with a base URL
const API = axios.create({
    baseURL: 'https://quiz-maker-api.onrender.com/', // This is your backend API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token to every outgoing request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
            config.headers['x-auth-token'] = token; // Attach token to x-auth-token header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API; // Export this configured Axios instance
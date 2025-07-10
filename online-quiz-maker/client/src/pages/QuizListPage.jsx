import React, { useEffect, useState } from 'react';
import API from '../api'; // Import your configured Axios instance
import { Link } from 'react-router-dom';

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const res = await API.get('/quizzes'); // Make GET request to your backend
                setQuizzes(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Failed to load quizzes. Please try again later.');
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []); // Empty dependency array means this runs once on component mount

    if (loading) {
        return <div style={containerStyle}>Loading quizzes...</div>;
    }

    if (error) {
        return <div style={{ ...containerStyle, color: 'red' }}>{error}</div>;
    }

    return (
        // <div className="page-container">
        <div style={containerStyle}>
            <h2 style={headingStyle}>Available Quizzes</h2>
            {quizzes.length === 0 ? (
                <p>No quizzes available yet. Create one!</p>
            ) : (
                <div style={quizGridStyle}>
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} style={quizCardStyle}>
                            <h3 style={quizTitleStyle}>{quiz.title}</h3>
                            <p style={quizDescriptionStyle}>{quiz.description}</p>
                            <p style={quizAuthorStyle}>By: {quiz.createdBy ? quiz.createdBy.username : 'Unknown'}</p>
                            <Link to={`/take-quiz/${quiz._id}`} style={takeQuizButtonStyle}>Take Quiz</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Basic inline styles (move to CSS later if preferred)
const containerStyle = {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const headingStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
};

const quizGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
};

const quizCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const quizTitleStyle = {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
    color: '#007bff',
};

const quizDescriptionStyle = {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1rem',
};

const quizAuthorStyle = {
    fontSize: '0.9rem',
    color: '#777',
    marginBottom: '1rem',
};

const takeQuizButtonStyle = {
    display: 'inline-block',
    padding: '0.8rem 1.2rem',
    backgroundColor: '#28a745', // Green for take quiz
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '1rem',
    marginTop: 'auto', // Push button to bottom
};


export default QuizListPage;
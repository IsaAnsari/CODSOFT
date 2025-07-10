import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api'; // Import your configured Axios instance

const TakeQuizPage = () => {
    const { id } = useParams(); // Get quiz ID from URL
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores selected option for each question

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/quizzes/${id}`); // Fetch quiz by ID
                setQuiz(res.data);
                // Initialize selected answers
                const initialAnswers = {};
                res.data.questions.forEach((_, index) => {
                    initialAnswers[index] = null; // No answer selected initially
                });
                setSelectedAnswers(initialAnswers);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching quiz:', err);
                setError('Failed to load quiz. It might not exist or there was a server error.');
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]); // Re-run if ID changes

    const handleOptionChange = (questionIndex, optionIndex) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: optionIndex,
        }));
    };

    const handleSubmitQuiz = () => {
        // Calculate score (simple client-side calculation for now)
        let score = 0;
        const totalQuestions = quiz.questions.length;
        const results = quiz.questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.correctAnswerIndex;
            if (isCorrect) {
                score++;
            }
            return {
                questionText: q.questionText,
                selectedOptionIndex: selectedAnswers[index],
                correctOptionIndex: q.correctAnswerIndex,
                isCorrect: isCorrect,
                options: q.options // Include options for display in results
            };
        });

        // Store results in localStorage or pass via state to results page
        localStorage.setItem('lastQuizResults', JSON.stringify({ score, totalQuestions, results, quizTitle: quiz.title }));
        navigate(`/quiz-results/${id}`); // Navigate to results page
    };

    if (loading) {
        return <div style={containerStyle}>Loading quiz...</div>;
    }

    if (error) {
        return <div style={{ ...containerStyle, color: 'red' }}>{error}</div>;
    }

    if (!quiz) {
        return <div style={containerStyle}>Quiz not found.</div>;
    }

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>{quiz.title}</h2>
            <p style={descriptionStyle}>{quiz.description}</p>
            <hr style={hrStyle} />

            {quiz.questions.map((question, qIndex) => (
                <div key={qIndex} style={questionCardStyle}>
                    <h3 style={questionTextStyle}>
                        {qIndex + 1}. {question.questionText}
                    </h3>
                    <div style={optionsContainerStyle}>
                        {question.options.map((option, optIndex) => (
                            <label key={optIndex} style={optionLabelStyle}>
                                <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    value={optIndex}
                                    checked={selectedAnswers[qIndex] === optIndex}
                                    onChange={() => handleOptionChange(qIndex, optIndex)}
                                    style={radioInputStyle}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button onClick={handleSubmitQuiz} style={submitQuizButtonStyle}>
                Submit Quiz
            </button>
        </div>
    );
};

// Styles (reused from previous components and new ones)
const containerStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f4f7f6',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const headingStyle = {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#333',
};

const descriptionStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#555',
    fontSize: '1.1rem',
};

const hrStyle = {
    border: 'none',
    borderTop: '1px solid #e0e0e0',
    margin: '2rem 0',
};

const questionCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem',
};

const questionTextStyle = {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#333',
};

const optionsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
};

const optionLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
        backgroundColor: '#f0f0f0',
    },
};

const radioInputStyle = {
    marginRight: '0.8rem',
    transform: 'scale(1.2)', // Make radio button slightly larger
};

const submitQuizButtonStyle = {
    display: 'block', // Make button take full width
    width: '100%',
    padding: '1rem 1.5rem',
    backgroundColor: '#007bff', // Blue submit button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '2rem',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
        backgroundColor: '#0056b3',
    },
};

export default TakeQuizPage;
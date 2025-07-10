import React, { useState } from 'react';
import API from '../api'; // Import your configured Axios instance
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // To protect the route

const CreateQuizPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
    ]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth(); // Check if user is logged in

    // Redirect if not logged in
    if (!user) {
        navigate('/login');
        return null; // Or show a loading/redirecting message
    }

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'options') {
            // Assuming value is an array of options or comma-separated string
            newQuestions[index][field] = value;
        } else {
            newQuestions[index][field] = value;
        }
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Basic validation
        if (!title || !description) {
            setError('Title and Description are required.');
            return;
        }
        for (const q of questions) {
            if (!q.questionText || q.options.some(opt => !opt) || q.options.length < 2 || q.correctAnswerIndex === undefined) {
                setError('All questions must have text, at least two options, and a correct answer selected.');
                return;
            }
            if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
                setError('Correct answer index is out of bounds for one or more questions.');
                return;
            }
        }


        try {
            const res = await API.post('/quizzes', {
                title,
                description,
                questions,
            });
            setMessage('Quiz created successfully!');
            // Optionally redirect after a short delay
            setTimeout(() => {
                navigate(`/quizzes`);
            }, 1500);
        } catch (err) {
            console.error('Error creating quiz:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to create quiz. Please try again.');
        }
    };

    return (
        <div style={formContainerStyle}>
            <h2 style={headingStyle}>Create a New Quiz</h2>
            {message && <p style={messageStyle(true)}>{message}</p>}
            {error && <p style={messageStyle(false)}>{error}</p>}
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={formGroupStyle}>
                    <label htmlFor="title" style={labelStyle}>Quiz Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <div style={formGroupStyle}>
                    <label htmlFor="description" style={labelStyle}>Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ ...inputStyle, minHeight: '80px' }}
                    />
                </div>

                <h3 style={subHeadingStyle}>Questions</h3>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} style={questionCardStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Question {qIndex + 1} Text:</label>
                            <input
                                type="text"
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={optionsGridStyle}>
                            {q.options.map((option, optIndex) => (
                                <div key={optIndex} style={formGroupStyle}>
                                    <label style={labelStyle}>Option {optIndex + 1}:</label>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...q.options];
                                            newOptions[optIndex] = e.target.value;
                                            handleQuestionChange(qIndex, 'options', newOptions);
                                        }}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Correct Answer (Option Index):</label>
                            <select
                                value={q.correctAnswerIndex}
                                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswerIndex', Number(e.target.value))}
                                style={inputStyle}
                            >
                                {q.options.map((_, optIndex) => (
                                    <option key={optIndex} value={optIndex}>
                                        Option {optIndex + 1}
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: '#666', marginTop: '0.5rem' }}> (0-indexed: Option 1 is 0, Option 2 is 1, etc.)</small>
                        </div>
                        {questions.length > 1 && (
                            <button type="button" onClick={() => removeQuestion(qIndex)} style={removeButtonStyle}>
                                Remove Question
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addQuestion} style={addQuestionButtonStyle}>
                    Add Question
                </button>
                <button type="submit" style={submitButtonStyle}>Create Quiz</button>
            </form>
        </div>
    );
};

// Reusing and adding styles
const formContainerStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
};

const headingStyle = {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
};

const subHeadingStyle = {
    fontSize: '1.2rem',
    marginTop: '2rem',
    marginBottom: '1rem',
    color: '#555',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
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

const messageStyle = (isSuccess) => ({
    padding: '0.8rem',
    borderRadius: '4px',
    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
    color: isSuccess ? '#155724' : '#721c24',
    border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`,
    marginBottom: '1rem',
    textAlign: 'center',
});

const questionCardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem',
};

const optionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
};

const removeButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
    alignSelf: 'flex-end', // Align to the right
};

const addQuestionButtonStyle = {
    padding: '0.8rem 1.2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginBottom: '1.5rem',
};

const submitButtonStyle = {
    padding: '1rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
};

export default CreateQuizPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuizResultPage = () => {
    const { id } = useParams(); // Get quiz ID (though we use localStorage for results)
    const navigate = useNavigate();
    const [quizResults, setQuizResults] = useState(null);

    useEffect(() => {
        const storedResults = localStorage.getItem('lastQuizResults');
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setQuizResults(parsedResults);
            // Optional: Clear after showing if results are temporary
            // localStorage.removeItem('lastQuizResults');
        } else {
            // If no results found, maybe redirect back to quizzes or home
            navigate('/quizzes');
        }
    }, [id, navigate]);

    if (!quizResults) {
        return <div style={containerStyle}>Loading results or no results found...</div>;
    }

    const { score, totalQuestions, results, quizTitle } = quizResults;

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Results for: "{quizTitle}"</h2>
            <p style={scoreStyle}>Your Score: {score} / {totalQuestions}</p>
            <hr style={hrStyle} />

            {results.map((qResult, index) => (
                <div key={index} style={questionResultCardStyle(qResult.isCorrect)}>
                    <h3 style={questionTextStyle}>
                        {index + 1}. {qResult.questionText}
                        <span style={correctIncorrectBadgeStyle(qResult.isCorrect)}>
                            {qResult.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                    </h3>
                    <ul style={optionsListStyle}>
                        {qResult.options.map((option, optIndex) => (
                            <li key={optIndex} style={optionItemStyle(optIndex, qResult.selectedOptionIndex, qResult.correctOptionIndex)}>
                                {option}
                                {optIndex === qResult.selectedOptionIndex && !qResult.isCorrect && (
                                    <span style={selectedIncorrectMarkStyle}> (Your Answer)</span>
                                )}
                                {optIndex === qResult.correctOptionIndex && (
                                    <span style={correctMarkStyle}> (Correct Answer)</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button onClick={() => navigate('/quizzes')} style={backToQuizzesButtonStyle}>
                Back to Quizzes
            </button>
        </div>
    );
};

// Styles (reused and new)
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

const scoreStyle = {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '2rem',
};

const hrStyle = {
    border: 'none',
    borderTop: '1px solid #e0e0e0',
    margin: '2rem 0',
};

const questionResultCardStyle = (isCorrect) => ({
    backgroundColor: isCorrect ? '#e6ffe6' : '#ffe6e6', // Light green for correct, light red for incorrect
    border: `1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`,
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem',
});

const questionTextStyle = {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const correctIncorrectBadgeStyle = (isCorrect) => ({
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    backgroundColor: isCorrect ? '#28a745' : '#dc3545',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 'normal',
});

const optionsListStyle = {
    listStyleType: 'none',
    padding: 0,
};

const optionItemStyle = (optIndex, selectedIndex, correctIndex) => {
    let style = {
        padding: '0.5rem 0',
        color: '#555',
        fontWeight: 'normal',
    };
    if (optIndex === correctIndex) {
        style = { ...style, fontWeight: 'bold', color: '#28a745' }; // Green for correct
    }
    if (optIndex === selectedIndex && optIndex !== correctIndex) {
        style = { ...style, fontWeight: 'bold', color: '#dc3545' }; // Red for incorrect selected
    }
    return style;
};

const selectedIncorrectMarkStyle = {
    color: '#dc3545',
    marginLeft: '0.5rem',
    fontSize: '0.9em',
    fontWeight: 'normal',
};

const correctMarkStyle = {
    color: '#28a745',
    marginLeft: '0.5rem',
    fontSize: '0.9em',
    fontWeight: 'normal',
};

const backToQuizzesButtonStyle = {
    display: 'block',
    width: '100%',
    padding: '1rem 1.5rem',
    backgroundColor: '#6c757d', // Grey for back button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '2rem',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
        backgroundColor: '#5a6268',
    },
};

export default QuizResultPage;
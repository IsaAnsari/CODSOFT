import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Import placeholder components (we'll create these files shortly)
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import QuizListPage from './pages/QuizListPage';
import CreateQuizPage from './pages/CreateQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';
import QuizResultPage from './pages/QuizResultPage';
import Navbar from './components/Navbar'; // We'll create this

function App() {
  return (
    <>
      <Navbar /> {/* This will be your navigation bar */}
      <div className="container"> {/* A div for page content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/take-quiz/:id" element={<TakeQuizPage />} />
          <Route path="/quiz-results/:id" element={<QuizResultPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
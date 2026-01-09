
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, AssessmentResult } from './types';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import Home from './components/Home';
import SubjectView from './components/SubjectView';
import ModuleView from './components/ModuleView';
import TopicDetail from './components/TopicDetail';
import QuizPlatform from './components/QuizPlatform';
import AssessmentFlow from './components/Assessment/AssessmentFlow';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize Auth from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('curious_fox_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('curious_fox_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('curious_fox_user');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    if (user) {
      const updatedUser = { ...user, assessmentResult: result };
      setUser(updatedUser);
      localStorage.setItem('curious_fox_user', JSON.stringify(updatedUser));
    }
  };

  const themeClass = isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-black';

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${themeClass}`}>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
        
        <main className="container mx-auto px-4 pb-20 pt-24">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/auth" 
                element={user ? <Navigate to="/" /> : <AuthForm onAuthSuccess={handleLogin} isDarkMode={isDarkMode} />} 
              />
              
              <Route 
                path="/" 
                element={user ? <Home isDarkMode={isDarkMode} /> : <Navigate to="/auth" />} 
              />
              
              <Route 
                path="/assessment" 
                element={user ? <AssessmentFlow onComplete={handleAssessmentComplete} isDarkMode={isDarkMode} /> : <Navigate to="/auth" />} 
              />
              
              <Route 
                path="/subject/:subjectId" 
                element={user ? <SubjectView isDarkMode={isDarkMode} /> : <Navigate to="/auth" />} 
              />
              
              <Route 
                path="/subject/:subjectId/module/:moduleId" 
                element={user ? <ModuleView isDarkMode={isDarkMode} /> : <Navigate to="/auth" />} 
              />

              <Route 
                path="/topic/:topicId" 
                element={user ? <TopicDetail isDarkMode={isDarkMode} /> : <Navigate to="/auth" />} 
              />

              <Route 
                path="/quiz" 
                element={user ? <QuizPlatform isDarkMode={isDarkMode} /> : <Navigate to="/auth" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
};

export default App;

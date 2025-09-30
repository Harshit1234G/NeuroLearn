import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/layout/Header';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import ParentDashboard from './components/parent/ParentDashboard';
import Practice from './components/student/Practice';
import Quiz from './components/student/Quiz';
import Results from './components/student/Results';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header />}
      <main>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/practice" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Practice />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/quiz/:topic" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/results/:resultId" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Results />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

// Import pages
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import StudentDashboard from './pages/Student/StudentDashboard.jsx'
import Assessment from './pages/Student/Assessment.jsx'
import Report from './pages/Student/Report.jsx'
import TeacherDashboard from './pages/Teacher/TeacherDashboard.jsx'
import StudentReport from './pages/Teacher/StudentReport.jsx'
import ParentDashboard from './pages/Parent/ParentDashboard.jsx'
import ApiTest from './components/ApiTest.jsx'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { user } = useAuth()
  
  if (user) {
    // Redirect based on user role
    if (user.role === 'student') return <Navigate to="/student" replace />
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />
    if (user.role === 'parent') return <Navigate to="/parent" replace />
  }
  
  return children
}

// Main App Component
function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Login />
              </div>
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Signup />
              </div>
            </PublicRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="min-h-screen bg-gray-50 p-6">
                <StudentDashboard />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/assessment" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="min-h-screen bg-gray-50 p-6">
                <Assessment />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/report/:reportId" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="min-h-screen bg-gray-50 p-6">
                <Report />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <div className="min-h-screen bg-gray-50 p-6">
                <TeacherDashboard />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/student/:studentId" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <div className="min-h-screen bg-gray-50 p-6">
                <StudentReport />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* Parent Routes */}
        <Route 
          path="/parent" 
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <div className="min-h-screen bg-gray-50 p-6">
                <ParentDashboard />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* API Test Route (for development) */}
        <Route 
          path="/api-test" 
          element={
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
                <ApiTest />
              </div>
            </div>
          } 
        />

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate 
                to={
                  user.role === 'student' ? '/student' :
                  user.role === 'teacher' ? '/teacher' :
                  user.role === 'parent' ? '/parent' : '/login'
                } 
                replace 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// Main App with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

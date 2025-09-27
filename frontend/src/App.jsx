import React from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import StudentDashboard from './pages/Student/StudentDashboard.jsx'
import Assessment from './pages/Student/Assessment.jsx'
import Report from './pages/Student/Report.jsx'
import TeacherDashboard from './pages/Teacher/TeacherDashboard.jsx'
import StudentReport from './pages/Teacher/StudentReport.jsx'
import ParentDashboard from './pages/Parent/ParentDashboard.jsx'

function ProtectedRoute({ children, allowed }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowed && !allowed.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-transparent bg-clip-text">Neuro Learn</Link>
          <nav className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="text-gray-600">{user.name} ({user.role})</span>
                <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-900 text-white hover:brightness-110">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 rounded bg-gray-900 text-white hover:brightness-110">Login</Link>
                <Link to="/signup" className="px-3 py-1.5 rounded border hover:bg-gray-50">Signup</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="text-xs text-center text-gray-500 py-6">Hackathon demo - AI Education Platform</footer>
    </div>
  )
}

function Home() {
  const { user } = useAuth()
  if (user) {
    if (user.role === 'student') return <Navigate to="/student" replace />
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />
    if (user.role === 'parent') return <Navigate to="/parent" replace />
  }
  return (
    <div className="pt-16">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 text-transparent bg-clip-text">Welcome to FunLearn AI</h1>
        <p className="text-gray-600 mb-8">Pick your role and jump into colorful learning!</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white shadow-soft">Login</Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-lg border bg-white hover:bg-gray-50">Signup</Link>
        </div>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 text-white shadow-soft">
          <h3 className="text-lg font-semibold">Student</h3>
          <p className="text-sm opacity-90">Take quizzes and see cool reports</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-white shadow-soft">
          <h3 className="text-lg font-semibold">Teacher</h3>
          <p className="text-sm opacity-90">Track class progress at a glance</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-400 text-white shadow-soft">
          <h3 className="text-lg font-semibold">Parent</h3>
          <p className="text-sm opacity-90">View your child’s learning journey</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <AuthProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/student" element={
                <ProtectedRoute allowed={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/assessment" element={
                <ProtectedRoute allowed={["student"]}>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="/student/report/:attemptId" element={
                <ProtectedRoute allowed={["student"]}>
                  <Report />
                </ProtectedRoute>
              } />

              <Route path="/teacher" element={
                <ProtectedRoute allowed={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/student/:studentId" element={
                <ProtectedRoute allowed={["teacher"]}>
                  <StudentReport />
                </ProtectedRoute>
              } />

              <Route path="/parent" element={
                <ProtectedRoute allowed={["parent"]}>
                  <ParentDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Layout>
    </AuthProvider>
  )
}



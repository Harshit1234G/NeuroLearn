import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser, getStudentByScholarNo, getTeacherById, getParentById } from '../api/api.js'

const AuthContext = createContext(null)

const LOCAL_KEY = 'ai-edu-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem(LOCAL_KEY)
      }
    }
  }, [])

  const login = async ({ email, password, role }) => {
    setLoading(true)
    setError(null)
    
    try {
      // Call the API login endpoint
      const response = await loginUser({ email, password, role })
      
      // Get additional user details based on role
      let userDetails = {}
      if (role === 'student' && response.scholar_no) {
        userDetails = await getStudentByScholarNo(response.scholar_no)
      } else if (role === 'teacher' && response.teacher_id) {
        userDetails = await getTeacherById(response.teacher_id)
      } else if (role === 'parent' && response.id) {
        userDetails = await getParentById(response.id)
      }
      
      const user = {
        id: response.scholar_no || response.teacher_id || response.id,
        email: response.email || email,
        role: role,
        name: userDetails.name || response.name,
        ...userDetails,
        ...response
      }
      
      setUser(user)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      setError(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Call the API register endpoint
      const response = await registerUser(userData)
      
      // Get additional user details based on role
      let userDetails = {}
      if (userData.role === 'student' && response.scholar_no) {
        userDetails = await getStudentByScholarNo(response.scholar_no)
      } else if (userData.role === 'teacher' && response.teacher_id) {
        userDetails = await getTeacherById(response.teacher_id)
      } else if (userData.role === 'parent' && response.id) {
        userDetails = await getParentById(response.id)
      }
      
      const user = {
        id: response.scholar_no || response.teacher_id || response.id,
        email: response.email || userData.email,
        role: userData.role,
        name: userDetails.name || response.name || userData.name,
        ...userDetails,
        ...response
      }
      
      setUser(user)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
      return user
    } catch (error) {
      setError(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem(LOCAL_KEY)
  }

  const clearError = () => {
    setError(null)
  }

  const value = { 
    user, 
    login, 
    signup, 
    logout, 
    loading, 
    error, 
    clearError 
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}



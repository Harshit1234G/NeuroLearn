import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const LOCAL_KEY = 'ai-edu-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = ({ email, role, name }) => {
    const mockUser = { id: 'u_' + Date.now(), email, role, name }
    setUser(mockUser)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(mockUser))
    return mockUser
  }

  const signup = ({ email, role, name }) => {
    return login({ email, role, name })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(LOCAL_KEY)
  }

  const value = { user, login, signup, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}



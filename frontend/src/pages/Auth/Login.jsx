import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login, loading, error, clearError } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'student' })

  const submit = async (e) => {
    e.preventDefault()
    clearError()
    
    try {
      const user = await login(form)
      if (user.role === 'student') nav('/student')
      if (user.role === 'teacher') nav('/teacher')
      if (user.role === 'parent') nav('/parent')
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <motion.h2 className="text-2xl font-semibold mb-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>Login</motion.h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-3">
          <input 
            className="w-full border rounded-lg px-3 py-2" 
            placeholder="Email" 
            type="email" 
            value={form.email} 
            onChange={e=>setForm({...form,email:e.target.value})} 
            required 
            disabled={loading}
          />
          <input 
            className="w-full border rounded-lg px-3 py-2" 
            placeholder="Password" 
            type="password" 
            value={form.password} 
            onChange={e=>setForm({...form,password:e.target.value})} 
            required 
            disabled={loading}
          />
          <select 
            className="w-full border rounded-lg px-3 py-2" 
            value={form.role} 
            onChange={e=>setForm({...form,role:e.target.value})}
            disabled={loading}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          <Button className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-sm mt-3">No account? <Link className="underline" to="/signup">Signup</Link></p>
      </Card>
    </div>
  )
}



import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

export default function Signup() {
  const { signup, loading, error, clearError } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ 
    email: '', 
    name: '', 
    password: '', 
    confirmPassword: '',
    role: 'student',
    scholar_no: '',
    class: '',
    section: '',
    teacher_id: '',
    subject: '',
    phone: '',
    student_scholar_no: ''
  })

  const submit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    try {
      // Prepare data based on role
      let userData = {
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role
      }
      
      // Add role-specific fields
      if (form.role === 'student') {
        userData.scholar_no = form.scholar_no
        userData.class = form.class
        userData.section = form.section
      } else if (form.role === 'teacher') {
        userData.teacher_id = form.teacher_id
        userData.subject = form.subject
      } else if (form.role === 'parent') {
        userData.phone = form.phone
        userData.student_scholar_no = form.student_scholar_no
      }
      
      const user = await signup(userData)
      if (user.role === 'student') nav('/student')
      if (user.role === 'teacher') nav('/teacher')
      if (user.role === 'parent') nav('/parent')
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Signup failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Signup</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-3">
          <input 
            className="w-full border rounded-lg px-3 py-2" 
            placeholder="Name" 
            value={form.name} 
            onChange={e=>setForm({...form,name:e.target.value})} 
            required 
            disabled={loading}
          />
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
          <input 
            className="w-full border rounded-lg px-3 py-2" 
            placeholder="Confirm Password" 
            type="password" 
            value={form.confirmPassword} 
            onChange={e=>setForm({...form,confirmPassword:e.target.value})} 
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
          
          {/* Role-specific fields */}
          {form.role === 'student' && (
            <>
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Scholar Number (e.g., S001)" 
                value={form.scholar_no} 
                onChange={e=>setForm({...form,scholar_no:e.target.value})} 
                required 
                disabled={loading}
              />
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Class (e.g., 8)" 
                value={form.class} 
                onChange={e=>setForm({...form,class:e.target.value})} 
                required 
                disabled={loading}
              />
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Section (e.g., A)" 
                value={form.section} 
                onChange={e=>setForm({...form,section:e.target.value})} 
                required 
                disabled={loading}
              />
            </>
          )}
          
          {form.role === 'teacher' && (
            <>
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Teacher ID (e.g., T001)" 
                value={form.teacher_id} 
                onChange={e=>setForm({...form,teacher_id:e.target.value})} 
                required 
                disabled={loading}
              />
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Subject (e.g., Math)" 
                value={form.subject} 
                onChange={e=>setForm({...form,subject:e.target.value})} 
                required 
                disabled={loading}
              />
            </>
          )}
          
          {form.role === 'parent' && (
            <>
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Phone Number" 
                value={form.phone} 
                onChange={e=>setForm({...form,phone:e.target.value})} 
                required 
                disabled={loading}
              />
              <input 
                className="w-full border rounded-lg px-3 py-2" 
                placeholder="Student Scholar Number (e.g., S001)" 
                value={form.student_scholar_no} 
                onChange={e=>setForm({...form,student_scholar_no:e.target.value})} 
                required 
                disabled={loading}
              />
            </>
          )}
          
          <Button className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-sm mt-3">Have an account? <Link className="underline" to="/login">Login</Link></p>
      </Card>
    </div>
  )
}



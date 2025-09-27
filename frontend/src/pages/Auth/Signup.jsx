import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', name: '', role: 'student' })

  const submit = (e) => {
    e.preventDefault()
    const user = signup(form)
    if (user.role === 'student') nav('/student')
    if (user.role === 'teacher') nav('/teacher')
    if (user.role === 'parent') nav('/parent')
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Signup</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <select className="w-full border rounded-lg px-3 py-2" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          <Button className="w-full">Create Account</Button>
        </form>
        <p className="text-sm mt-3">Have an account? <Link className="underline" to="/login">Login</Link></p>
      </Card>
    </div>
  )
}



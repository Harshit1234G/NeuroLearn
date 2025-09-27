import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchQuestions, submitAssessment } from '../../api/api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'

export default function Assessment() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        setError(null)
        const qs = await fetchQuestions()
        setQuestions(qs)
      } catch (err) {
        setError(err.message || 'Failed to load questions')
        console.error('Failed to load questions:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadQuestions()
  }, [])

  const select = (idx) => {
    const next = [...answers]
    next[current] = idx
    setAnswers(next)
  }

  const nextQ = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1)
    else finish()
  }

  const finish = async () => {
    try {
      setSubmitting(true)
      setError(null)
      const attempt = await submitAssessment({ 
        userId: user.id, 
        answers,
        scholarNo: user.scholar_no || user.id 
      })
      nav(`/student/report/${attempt.id}`)
    } catch (err) {
      setError(err.message || 'Failed to submit assessment')
      console.error('Failed to submit assessment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <p className="text-center">Loading questions...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    )
  }

  if (!questions.length) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <p className="text-center">No questions available.</p>
      </Card>
    )
  }
  const q = questions[current]

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="mb-4 text-sm text-gray-600">Question {current + 1} of {questions.length}</div>
      <h3 className="text-lg font-semibold mb-4">{q.text}</h3>
      <div className="grid gap-3">
        {q.options.map((opt, idx) => (
          <motion.label key={idx} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer text-lg ${answers[current]===idx? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400' : 'hover:bg-gray-50'}`} whileTap={{ scale: 0.98 }}>
            <input type="radio" name="opt" checked={answers[current]===idx} onChange={()=>select(idx)} />
            <span>{opt}</span>
          </motion.label>
        ))}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-6">
        <Button 
          variant="outline" 
          disabled={current===0 || submitting} 
          onClick={()=>setCurrent(c=>c-1)} 
          className="disabled:opacity-50"
        >
          Back
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={nextQ} disabled={submitting}>Next</Button>
        ) : (
          <Button onClick={finish} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Finish'}
          </Button>
        )}
      </div>
    </Card>
  )
}



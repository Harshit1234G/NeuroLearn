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

  useEffect(() => {
    fetchQuestions().then(qs => setQuestions(qs))
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
    const attempt = await submitAssessment({ userId: user.id, answers })
    nav(`/student/report/${attempt.id}`)
  }

  if (!questions.length) return <p>Loading questions...</p>
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
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" disabled={current===0} onClick={()=>setCurrent(c=>c-1)} className="disabled:opacity-50">Back</Button>
        {current < questions.length - 1 ? (
          <Button onClick={nextQ}>Next</Button>
        ) : (
          <Button onClick={finish}>Finish</Button>
        )}
      </div>
    </Card>
  )
}



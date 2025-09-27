import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchStudentReports } from '../../api/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { ProgressBar, ProgressRing } from '../../components/ui/Progress.jsx'
import { SkillsRadar, ScoresBar } from '../../components/ui/Charts.jsx'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function Report() {
  const { attemptId } = useParams()
  const { user } = useAuth()
  const [reports, setReports] = useState([])

  useEffect(() => {
    fetchStudentReports(user.id).then(setReports)
  }, [user.id])

  const report = useMemo(() => reports.find(r => r.id === attemptId), [reports, attemptId])
  useEffect(() => {
    if (report && report.score >= 70) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
    }
  }, [report])
  if (!report) return <p>Loading report...</p>

  const categories = [
    { key: 'listening', label: 'Listening' },
    { key: 'grasping', label: 'Grasping' },
    { key: 'retention', label: 'Retention' },
    { key: 'application', label: 'Application' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-1">Your Report</h2>
        <p className="text-sm text-gray-600 mb-4">{new Date(report.createdAt).toLocaleString()}</p>
        <div className="flex items-center gap-6">
          <ProgressRing value={report.score} />
          <div>
            <p className="text-2xl font-bold">Score: {report.score}%</p>
            <p className="text-sm text-gray-600">Great job! Keep it up! 🎉</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <p className="font-medium mb-2">Category Progress</p>
          <ScoresBar data={categories.map(c => ({ label: c.label, value: report.insights[c.key] }))} />
        </Card>
        <Card className="p-4">
          <p className="font-medium mb-2">Skills Radar</p>
          <SkillsRadar data={categories.map(c => ({ skill: c.label, value: report.insights[c.key] }))} />
        </Card>
      </div>

      <Link to="/student"><Button variant="outline">Back to Dashboard</Button></Link>
    </div>
  )
}



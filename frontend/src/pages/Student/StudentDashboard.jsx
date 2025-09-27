import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Avatar from '../../components/ui/Avatar.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { ProgressBar } from '../../components/ui/Progress.jsx'
import Sidebar from '../../components/ui/Sidebar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchStudentReports } from '../../api/api.js'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])

  useEffect(() => {
    fetchStudentReports(user.id).then(setReports)
  }, [user.id])

  return (
    <div className="flex gap-6">
      <Sidebar role="student" />
      <div className="flex-1 space-y-6">
        <Card variant="gradient" className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size={56} />
            <div>
              <h2 className="text-2xl font-semibold">Hey {user.name}!</h2>
              <p className="opacity-90">Ready to take your next assessment?</p>
            </div>
          </div>
          <Link to="/student/assessment"><Button variant="fun">Start Assessment</Button></Link>
        </Card>

        {reports.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Best Score</p>
              <p className="text-2xl font-semibold mt-1">{Math.max(...reports.map(r=>r.score))}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Last Score</p>
              <p className="text-2xl font-semibold mt-1">{reports[0].score}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Attempts</p>
              <p className="text-2xl font-semibold mt-1">{reports.length}</p>
            </Card>
          </div>
        )}

        <section>
          <h3 className="font-semibold mb-2">Past Reports</h3>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-600">No reports yet. Take an assessment to see your progress.</p>
          ) : (
            <Card className="divide-y">
              {reports.map((r, i) => (
                <motion.div key={r.id} className="p-3 flex items-center justify-between" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Score: {r.score}%</p>
                      {r.score >= 80 && <Badge color="green">Star</Badge>}
                      {r.score >= 60 && r.score < 80 && <Badge color="blue">Achiever</Badge>}
                    </div>
                    <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <Link to={`/student/report/${r.id}`} className="text-blue-600 underline text-sm">View</Link>
                </motion.div>
              ))}
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}



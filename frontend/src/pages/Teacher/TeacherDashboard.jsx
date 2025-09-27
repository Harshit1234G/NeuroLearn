import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchClassPerformance, mockStudents } from '../../api/api.js'
import Card from '../../components/ui/Card.jsx'
import Sidebar from '../../components/ui/Sidebar.jsx'
import { motion } from 'framer-motion'

export default function TeacherDashboard() {
  const [summary, setSummary] = useState({ classAvg: 0, students: [] })

  useEffect(() => {
    fetchClassPerformance().then(setSummary)
  }, [])

  const students = summary.students.length ? summary.students : mockStudents()

  return (
    <div className="flex gap-6">
      <Sidebar role="teacher" />
      <div className="flex-1 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Class Performance</h2>
          <p className="text-2xl font-bold mt-2">Average Score: {summary.classAvg}%</p>
        </Card>

        <section>
          <h3 className="font-semibold mb-2">Students</h3>
          <Card className="divide-y">
            {students.map((s, i) => (
              <motion.div key={s.id} className="p-3 flex items-center justify-between" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </div>
                <Link to={`/teacher/student/${s.id}`} className="text-blue-600 underline text-sm">View Report</Link>
              </motion.div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  )
}



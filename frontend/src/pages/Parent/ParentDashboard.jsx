import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchStudentReports, mockStudents } from '../../api/api.js'
import Card from '../../components/ui/Card.jsx'
import Sidebar from '../../components/ui/Sidebar.jsx'

export default function ParentDashboard() {
  const { user } = useAuth()
  // For demo: parent is tied to first mock student
  const child = mockStudents()[0]
  const [reports, setReports] = useState([])

  useEffect(() => {
    fetchStudentReports(child.id).then(setReports)
  }, [child.id])

  return (
    <div className="flex gap-6">
      <Sidebar role="parent" />
      <div className="flex-1 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
          <p className="text-gray-600">Viewing reports for: {child.name}</p>
        </Card>

        {reports.length === 0 ? (
          <p className="text-sm text-gray-600">No reports yet.</p>
        ) : (
          <Card className="divide-y">
            {reports.map(r => (
              <div key={r.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">Score: {r.score}%</p>
                  <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 text-sm text-gray-700">
                  {Object.entries(r.insights).map(([k,v]) => (
                    <span key={k} className="capitalize">{k}: <b>{v}%</b></span>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}



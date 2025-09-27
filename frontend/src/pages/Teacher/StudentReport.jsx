import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchStudentReportById, mockStudents } from '../../api/api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Sidebar from '../../components/ui/Sidebar.jsx'

export default function StudentReport() {
  const { studentId } = useParams()
  const [reports, setReports] = useState([])
  const student = mockStudents().find(s => s.id === studentId) || { name: 'Student' }

  useEffect(() => {
    fetchStudentReportById(studentId).then(setReports)
  }, [studentId])

  return (
    <div className="flex gap-6">
      <Sidebar role="teacher" />
      <div className="flex-1 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">{student.name}'s Reports</h2>
        </Card>
        {reports.length === 0 ? (
          <p className="text-sm text-gray-600">No reports for this student yet.</p>
        ) : (
          <Card className="divide-y">
            {reports.map(r => (
              <div key={r.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Score: {r.score}%</p>
                    <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm">
                  {Object.entries(r.insights).map(([k,v]) => (
                    <div key={k} className="bg-gray-50 border rounded p-2">
                      <p className="capitalize">{k}</p>
                      <p className="font-semibold">{v}%</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        )}
        <Link to="/teacher"><Button variant="outline">Back</Button></Link>
      </div>
    </div>
  )
}



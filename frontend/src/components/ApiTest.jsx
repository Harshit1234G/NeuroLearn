import React, { useState } from 'react'
import { healthCheck, getAllStudents, getAllTeachers, getAllParents } from '../api/api.js'
import Card from './ui/Card.jsx'
import Button from './ui/Button.jsx'

export default function ApiTest() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})

  const testEndpoint = async (name, testFn) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    try {
      const result = await testFn()
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }))
    } catch (error) {
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }))
    }
  }

  const tests = [
    { name: 'Health Check', fn: healthCheck },
    { name: 'Get Students', fn: getAllStudents },
    { name: 'Get Teachers', fn: getAllTeachers },
    { name: 'Get Parents', fn: getAllParents },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      <div className="space-y-3">
        {tests.map(test => (
          <div key={test.name} className="flex items-center justify-between p-3 border rounded">
            <span className="font-medium">{test.name}</span>
            <div className="flex items-center gap-2">
              {loading[test.name] && <span className="text-sm text-gray-500">Testing...</span>}
              {results[test.name] && (
                <span className={`text-sm ${results[test.name].success ? 'text-green-600' : 'text-red-600'}`}>
                  {results[test.name].success ? '✓ Success' : '✗ Failed'}
                </span>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => testEndpoint(test.name, test.fn)}
                disabled={loading[test.name]}
              >
                Test
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {Object.keys(results).length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Results:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  )
}

// API Configuration
const API_BASE_URL = 'http://localhost:3010'

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Health Check
export async function healthCheck() {
  return apiCall('/')
}

// ==================== AUTH API ====================
export async function registerUser(userData) {
  return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function loginUser(credentials) {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

// ==================== STUDENT API ====================
export async function getAllStudents() {
  return apiCall('/api/students')
}

export async function createStudent(studentData) {
  return apiCall('/api/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  })
}

export async function getStudentByScholarNo(scholarNo) {
  return apiCall(`/api/students/${scholarNo}`)
}

// ==================== TEACHER API ====================
export async function getAllTeachers() {
  return apiCall('/api/teachers')
}

export async function createTeacher(teacherData) {
  return apiCall('/api/teachers', {
    method: 'POST',
    body: JSON.stringify(teacherData),
  })
}

export async function getTeacherById(teacherId) {
  return apiCall(`/api/teachers/${teacherId}`)
}

// ==================== PARENT API ====================
export async function getAllParents() {
  return apiCall('/api/parents')
}

export async function createParent(parentData) {
  return apiCall('/api/parents', {
    method: 'POST',
    body: JSON.stringify(parentData),
  })
}

export async function getParentById(parentId) {
  return apiCall(`/api/parents/${parentId}`)
}

// ==================== RESULTS API ====================
export async function saveResult(resultData) {
  return apiCall('/api/results', {
    method: 'POST',
    body: JSON.stringify(resultData),
  })
}

export async function getStudentResults(scholarNo) {
  return apiCall(`/api/results?student_scholar_no=${scholarNo}`)
}

// ==================== ASSESSMENT FUNCTIONS ====================
// Mock questions for now - you can replace with real API later
export async function fetchQuestions() {
  // For now, return mock questions. You can create an API endpoint for this later
  await delay(300)
  return [
    { id: 'q1', text: 'What is 2 + 2?', options: ['2', '3', '4', '5'], answer: 2, category: 'application' },
    { id: 'q2', text: 'Which is a mammal?', options: ['Shark', 'Dolphin', 'Trout', 'Salmon'], answer: 1, category: 'grasping' },
    { id: 'q3', text: 'Listen: Identify the spoken word (pretend)', options: ['Cat', 'Dog', 'Bird', 'Fish'], answer: 0, category: 'listening' },
    { id: 'q4', text: 'Remember: Capital of France?', options: ['Rome', 'Paris', 'Berlin', 'Madrid'], answer: 1, category: 'retention' },
  ]
}

export async function submitAssessment({ userId, answers, scholarNo }) {
  // Calculate score
  const questions = await fetchQuestions()
  let correct = 0
  const perCategory = { listening: 0, grasping: 0, retention: 0, application: 0 }
  const totals = { listening: 0, grasping: 0, retention: 0, application: 0 }
  
  for (const q of questions) totals[q.category]++
  
  answers.forEach((ans, idx) => {
    const q = questions[idx]
    if (q && ans === q.answer) {
      correct++
      perCategory[q.category]++
    }
  })
  
  const score = Math.round((correct / questions.length) * 100)
  const insights = Object.fromEntries(
    Object.entries(perCategory).map(([k, v]) => [k, totals[k] ? Math.round((v / totals[k]) * 100) : 0])
  )
  
  // Save result to API
  try {
    await saveResult({
      student_scholar_no: scholarNo,
      topic: 'Assessment',
      accuracy: score
    })
  } catch (error) {
    console.error('Failed to save result to API:', error)
    // Fallback to localStorage
    const attempt = {
      id: 'a_' + Date.now(),
      userId,
      score,
      insights,
      createdAt: new Date().toISOString(),
    }
    const prev = JSON.parse(localStorage.getItem('attempts') || '[]')
    prev.push(attempt)
    localStorage.setItem('attempts', JSON.stringify(prev))
    return attempt
  }
  
  return {
    id: 'a_' + Date.now(),
    userId,
    score,
    insights,
    createdAt: new Date().toISOString(),
  }
}

export async function fetchStudentReports(userId, scholarNo) {
  try {
    // Try to fetch from API first
    if (scholarNo) {
      const results = await getStudentResults(scholarNo)
      return results.map(result => ({
        id: result.id || 'r_' + Date.now(),
        userId,
        score: result.accuracy,
        insights: { overall: result.accuracy },
        createdAt: result.created_at || new Date().toISOString(),
        topic: result.topic
      }))
    }
  } catch (error) {
    console.error('Failed to fetch from API, using localStorage:', error)
  }
  
  // Fallback to localStorage
  await delay(200)
  const attempts = JSON.parse(localStorage.getItem('attempts') || '[]')
  return attempts.filter(a => a.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function fetchClassPerformance() {
  try {
    // Get all students from API
    const students = await getAllStudents()
    
    // For now, return mock data. You can enhance this to get real performance data
    return {
      classAvg: 75,
      students: students.map(student => ({
        id: student.scholar_no,
        name: student.name,
        email: student.email || `${student.scholar_no}@school.com`,
        class: student.class,
        section: student.section
      }))
    }
  } catch (error) {
    console.error('Failed to fetch class performance from API:', error)
    // Fallback to mock data
    return {
      classAvg: 75,
      students: mockStudents()
    }
  }
}

export async function fetchStudentReportById(studentId) {
  try {
    // Try to get student by scholar number
    const student = await getStudentByScholarNo(studentId)
    if (student) {
      const results = await getStudentResults(studentId)
      return results.map(result => ({
        id: result.id || 'r_' + Date.now(),
        userId: studentId,
        score: result.accuracy,
        insights: { overall: result.accuracy },
        createdAt: result.created_at || new Date().toISOString(),
        topic: result.topic
      }))
    }
  } catch (error) {
    console.error('Failed to fetch student report from API:', error)
  }
  
  // Fallback to localStorage
  await delay(200)
  const attempts = JSON.parse(localStorage.getItem('attempts') || '[]')
  return attempts.filter(a => a.userId === studentId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

// Helper functions
export function mockStudents() {
  return [
    { id: 'stu_1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'stu_2', name: 'Bob Smith', email: 'bob@example.com' },
    { id: 'stu_3', name: 'Charlie Kim', email: 'charlie@example.com' },
  ]
}

function average(arr) {
  if (!arr.length) return 0
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}



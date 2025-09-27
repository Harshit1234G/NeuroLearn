// Mock API functions for demo

export async function fetchQuestions() {
  await delay(300)
  return [
    { id: 'q1', text: 'What is 2 + 2?', options: ['2', '3', '4', '5'], answer: 2, category: 'application' },
    { id: 'q2', text: 'Which is a mammal?', options: ['Shark', 'Dolphin', 'Trout', 'Salmon'], answer: 1, category: 'grasping' },
    { id: 'q3', text: 'Listen: Identify the spoken word (pretend)', options: ['Cat', 'Dog', 'Bird', 'Fish'], answer: 0, category: 'listening' },
    { id: 'q4', text: 'Remember: Capital of France?', options: ['Rome', 'Paris', 'Berlin', 'Madrid'], answer: 1, category: 'retention' },
  ]
}

export async function submitAssessment({ userId, answers }) {
  await delay(300) 
  // compute score
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

export async function fetchStudentReports(userId) {
  await delay(200)
  const attempts = JSON.parse(localStorage.getItem('attempts') || '[]')
  return attempts.filter(a => a.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function fetchClassPerformance() {
  await delay(200)
  const attempts = JSON.parse(localStorage.getItem('attempts') || '[]')
  const students = mockStudents()
  // aggregate last attempt per student if any
  const latestByStudent = {}
  for (const a of attempts) {
    if (!latestByStudent[a.userId] || latestByStudent[a.userId].createdAt < a.createdAt) {
      latestByStudent[a.userId] = a
    }
  }
  const classAvg = average(Object.values(latestByStudent).map(a => a.score)) || 0
  return { classAvg, students }
}

export async function fetchStudentReportById(studentId) {
  await delay(200)
  const attempts = JSON.parse(localStorage.getItem('attempts') || '[]')
  return attempts.filter(a => a.userId === studentId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

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



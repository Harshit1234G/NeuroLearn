# API Setup

## Requirements
- node.js
- npm

## Setup
1. `cd api/`
2. `npm install`
3. `npm run dev` Starts server at http://localhost:3010

## Endpoints
- `GET /` Health Check

_Student API_
- `GET /api/students` Gets all students
- `POST /api/students` Create student
eg. Body: `{ "scholar_no": "S001", "name": "Dayal", "class": "8", "section": "A" }`
- `GET /api/students/:S001` Get student by scholar no. (login simulation) 

_Auth API_
- `POST /api/auth/register` Role based register
eg. Body: `{ "role": "student", "scholar_no": "S001", "name": "...", "email": "...", "password": "..."}`
- `POST /api/auth/login` Role based login
eg. Body: `{ "email": "...", "password": "...", "role": "student" }`

_Assessment API_
- `POST /api/assessment/start` start/resume assessment
eg. Body: `{ "scholar_no": "S001", "topic": "Percentages" }`
    Response `{ "sessionId": 1, "message": "Assessment Started" }`
- `GET /api/assessment/question/1` 
eg. Response `{ 
                "question": { "id": 7, "question_text": "...", "option_a": "...", ...}
                "sessionId": 1,
                "questionNumber": 1
            }`
- `POST /api/assessment/answer` submit answer
eg. Body: `{ "sessionId": 1, "questionId": 7, "submitAnswer": "c" }`
    Response `{ "isCorrect": true, "currentScore": 1, "completed": false, "nextDifficulty": "Easy" }`
- `GET /api/assessment/report/1` Get final report after 10 question
eg. Response `{ "student": "Rahul", "topic": "Percentage", "score": 8, "diagnosis": "Strong grasp of concepts", "student_report": "...", "teacher_report": "...", "parent_report": "..." }`

_AI Reports API_
- `POST /api/ai-reports` Save ai generated report (for AI dev)
eg. Body: `{ "session_id": 1, "diagnosis": "Strong grasp of concepts", "student_report": "...", "teacher_report": "...", "parent_report": "...", "tutor_notes": "..." }`
- `GET /api/ai-reports/1` Get report by session ID (for UI)
eg. Response Same as POST body + id, generated_at

_Results API_
- `POST /api/results` save result of student
eg. Body: `{ "student_scholar_no": "S001", "topic": "Percentage", "accuracy": 85.5 }`
- `GET /api/results?student_scholar_no=S001` get result of student using query

_Parent API_
- `GET /api/parents` Get all parents
- `POST /api/parents` create parent
eg. Body: `{ "name": "Papa", "phone": "9917354193", "email": "test@gmail.com", "student_scholar_no": "S001" }`
- `GET /api/parents/:id` Get parent by ID (login simulation)

_Teacher API_
- `GET /api/teachers` Get all teachers
- `POST /api/teachers` create teacher
eg. Body: `{ "teacher_id": "T001", "name": "Marsaab", "subject": "Math", "email": "marsaab@vidhya.com" }`
- `GET /api/teachers/T001` Get teacher by ID (for login)

## DB
- Auto created at `/db/neurolearn.sqlite`
- Schema auto-applied on server start

## Scripts
- `npm run dev` run server with auto-reload
- `npm start` production server

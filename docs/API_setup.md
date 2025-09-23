# API Setup

## Requirements
- node.js
- npm

## Setup
1. `cd api/`
2. `npm install`
3. `npm run dev` Starts server at http://localhost:3000

## Endpoints
- `GET /` Health Check

_Student API_
- `GET /api/students` Gets all students
- `POST /api/students` Create student
eg. Body: `{ "scholar_no": "S001", "name": "Dayal", "class": "8", "section": "A" }`
- `GET /api/students/:S001` Get student by scholar no. (login simulation) 

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

# API Integration Guide

## Overview
Your website has been successfully integrated with all the API endpoints you provided. The integration includes comprehensive error handling, loading states, and fallback mechanisms.

## What's Been Integrated

### 1. API Service Layer (`src/api/api.js`)
- **Complete API wrapper** with all endpoints from your documentation
- **Error handling** with proper HTTP status code checking
- **Fallback mechanisms** to localStorage when API is unavailable
- **Centralized configuration** with `API_BASE_URL = 'http://localhost:3010'`

### 2. Authentication System (`src/context/AuthContext.jsx`)
- **Real API authentication** using `/api/auth/login` and `/api/auth/register`
- **Role-based user data fetching** (student, teacher, parent)
- **Loading states** and error handling
- **Automatic user details retrieval** based on role

### 3. Login Component (`src/pages/Auth/Login.jsx`)
- **Password-based authentication** (removed mock name field)
- **Role selection** (student, teacher, parent)
- **Error display** and loading states
- **Form validation**

### 4. Signup Component (`src/pages/Auth/Signup.jsx`)
- **Role-specific registration forms**
- **Student fields**: scholar_no, class, section
- **Teacher fields**: teacher_id, subject
- **Parent fields**: phone, student_scholar_no
- **Password confirmation** and validation

### 5. Student Components
- **StudentDashboard**: Fetches reports using scholar number
- **Assessment**: Saves results to API using scholar number
- **Error handling** and loading states

### 6. Teacher Components
- **TeacherDashboard**: Uses API to fetch class performance
- **StudentReport**: Fetches individual student reports

### 7. Parent Components
- **ParentDashboard**: Fetches child's data and reports using student_scholar_no

## API Endpoints Integrated

### Auth API
- `POST /api/auth/register` - Role-based registration
- `POST /api/auth/login` - Role-based login

### Student API
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:scholarNo` - Get student by scholar number

### Teacher API
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher
- `GET /api/teachers/:teacherId` - Get teacher by ID

### Parent API
- `GET /api/parents` - Get all parents
- `POST /api/parents` - Create parent
- `GET /api/parents/:id` - Get parent by ID

### Results API
- `POST /api/results` - Save assessment results
- `GET /api/results?student_scholar_no=:scholarNo` - Get student results

## Key Features

### Error Handling
- **Network error detection** with user-friendly messages
- **Retry mechanisms** for failed requests
- **Fallback to localStorage** when API is unavailable
- **Loading states** to improve user experience

### Data Flow
1. **Login/Register** → API authentication
2. **User details** → Fetched based on role and ID
3. **Dashboard data** → Retrieved from appropriate API endpoints
4. **Assessment results** → Saved to results API

### Fallback System
- If API is unavailable, the system falls back to localStorage
- This ensures the app continues to work even without the backend
- Users get appropriate error messages when API calls fail

## Testing

### API Test Component
A test component (`src/components/ApiTest.jsx`) has been created to verify API connectivity:
- Tests health check endpoint
- Tests all major API endpoints
- Shows success/failure status
- Displays response data

### How to Test
1. Start your API server: `cd api/ && npm run dev`
2. Start your frontend: `npm run dev`
3. Use the API test component to verify connectivity
4. Test login/signup with real API data
5. Take assessments and verify results are saved

## Usage Examples

### Student Registration
```javascript
// Student signup data
{
  "role": "student",
  "scholar_no": "S001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "class": "8",
  "section": "A"
}
```

### Teacher Registration
```javascript
// Teacher signup data
{
  "role": "teacher",
  "teacher_id": "T001",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "subject": "Math"
}
```

### Parent Registration
```javascript
// Parent signup data
{
  "role": "parent",
  "name": "Parent Name",
  "email": "parent@example.com",
  "password": "password123",
  "phone": "9917354193",
  "student_scholar_no": "S001"
}
```

## Configuration

### API Base URL
The API base URL is configured in `src/api/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3010'
```

### Environment Setup
1. Ensure your API server is running on port 3010
2. The frontend will automatically connect to the API
3. If the API is not available, the app will show appropriate error messages

## Next Steps

1. **Start your API server** using the provided documentation
2. **Test the integration** using the login/signup forms
3. **Create test data** using the API endpoints
4. **Verify assessment results** are being saved correctly
5. **Customize the UI** as needed for your specific requirements

## Troubleshooting

### Common Issues
1. **API not responding**: Check if the server is running on port 3010
2. **CORS errors**: Ensure your API server allows requests from your frontend
3. **Authentication failures**: Verify the API endpoints are working correctly
4. **Data not loading**: Check browser console for error messages

### Debug Mode
- All API calls are logged to the browser console
- Error messages are displayed to users
- The API test component helps identify connectivity issues

Your website is now fully integrated with all the API endpoints! 🎉

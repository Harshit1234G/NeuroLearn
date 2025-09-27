## AI Education Platform (React + Vite + Tailwind)

A friendly, student-focused, AI-ready education platform with three roles: Student, Teacher, and Parent. This project is designed for hackathons and demos, is easy to run locally, and is easy to connect to real AI APIs later.

### What’s inside (high level)
- Modern UI with colorful, kid-friendly design and smooth animations
- Role-based dashboards (Student, Teacher, Parent)
- Student assessments with reports and charts
- Mock authentication and mock APIs that you can replace later

---

## 1) Project Overview
This project simulates an AI-powered education platform:

- **Student**: Logs in, starts assessments (multiple-choice), and sees their reports with scores and skill insights.
- **Teacher**: Views class performance and checks individual student reports.
- **Parent**: Reviews their child’s recent results and insights.

Everything is front-end only (no backend). Authentication and API calls are mocked so you can demo quickly. Later, you can connect real endpoints (e.g., OpenAI or your backend).

---

## 2) Tech Stack
- **React + Vite + TailwindCSS**: Fast development, modern styling.
- **React Router**: Navigation and role-based routes.
- **Context API**: Simple mock auth and role management.
- **Mock API (`src/api/api.js`)**: All data comes from mocked functions; easy to replace with real APIs later.
- **Framer Motion**: Smooth page transitions and micro-interactions.
- **Recharts**: Simple, responsive charts (bar, radar) on the Student Report page.

---

## 3) Project Structure
```
src/
  api/
    api.js                 # Mock API functions and data storage (localStorage)

  components/
    ui/
      Avatar.jsx           # Initials-based colorful avatar
      Badge.jsx            # Small colored labels for achievements
      Button.jsx           # Reusable button variants (primary, fun, outline)
      Card.jsx             # Glass/gradient/soft card variants
      Charts.jsx           # Recharts components: bar + radar charts
      Progress.jsx         # ProgressBar and ProgressRing (circular)
      Sidebar.jsx          # Fun role-based sidebar with icons

  context/
    AuthContext.jsx        # Mock auth, role, and user session (localStorage)

  pages/
    Auth/
      Login.jsx            # Mock login (choose name, email, role)
      Signup.jsx           # Mock signup (same as login flow)
    Student/
      StudentDashboard.jsx # Welcome, quick stats, past reports, Start Assessment
      Assessment.jsx       # Quiz-like assessment with big, interactive options
      Report.jsx           # Game-like results screen with charts, confetti
    Teacher/
      TeacherDashboard.jsx # Class overview and student list
      StudentReport.jsx    # Selected student’s report list
    Parent/
      ParentDashboard.jsx  # Child’s reports and insights

  App.jsx                  # Routes + protected routes + animated transitions
  main.jsx                 # React entry
  index.css                # Tailwind base imports + global styles
```

### What each page does
- **Auth (Login/Signup)**: Enter a name, email, and pick a role. No backend; data is stored in the browser until you log out.
- **Student Dashboard**: Friendly welcome with avatar, quick stats, badges, and past reports. A big colorful button starts the assessment.
- **Assessment**: Multiple-choice questions fetched from a mock API. Big, touch-friendly answer buttons and subtle animations.
- **Report**: “Game results” style with a circular score ring, bar and radar charts for skills, and an encouraging message. Confetti pops for higher scores.
- **Teacher Dashboard**: Class average and a list of students. Click a student to see their reports.
- **Parent Dashboard**: Shows the child’s recent reports and insights.

---

## 4) How to Run Locally
### Prerequisites
- Install **Node.js** (LTS) which includes `npm`.

### Steps
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173` (Vite will print the exact URL).

---

## 5) How to Deploy (Vercel quick start)
Vercel is a popular, simple way to deploy Vite apps.

1. Push this project to a GitHub repository.
2. Go to `https://vercel.com` and sign in.
3. Click “New Project” → “Import Git Repository” → choose your repo.
4. Vercel auto-detects Vite. Press “Deploy”.
5. Share your live link (Vercel gives you one instantly).

That’s it. If you add environment variables later (API keys), set them in the Vercel project settings and redeploy.

---

## 6) How to Integrate Real APIs (replace mocks)
All mocked calls live in `src/api/api.js`. Replace or augment them with real network calls. Here’s a conceptual example of fetching questions from an AI API (e.g., OpenAI GPT-4o-mini) and returning multiple-choice data. This example uses Vite environment variables (they must be prefixed with `VITE_`).

### 6.1 Add an API key
Create a `.env` file in the project root:
```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

Restart `npm run dev` after changing `.env`.

### 6.2 Example: Replace `fetchQuestions()`
```js
// src/api/api.js
export async function fetchQuestions() {
  // Example payload you might send to your AI service
  const prompt = {
    topic: 'Math Basics',
    numQuestions: 4,
    format: 'mcq',
  }

  // Call your API
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You generate short MCQ quizzes as JSON.' },
        { role: 'user', content: `Create ${prompt.numQuestions} ${prompt.topic} MCQs. Return JSON with id, text, options (array), answer (index), and category (listening/grasping/retention/application).` },
      ],
      temperature: 0.7,
    }),
  })

  const data = await res.json()

  // This part depends on how your AI returns structured JSON.
  // For example, if the AI returns JSON in data.choices[0].message.content:
  // Parse it to an array like the current mock (id, text, options, answer, category).
  const questions = JSON.parse(data.choices[0].message.content)
  return questions
}
```

### 6.3 Where to send results
- `submitAssessment(...)` currently calculates the score locally and stores attempts in `localStorage`.
- You can replace it to POST answers to your backend, and return a result with:
  - `score` (0–100)
  - `insights` per category: `{ listening, grasping, retention, application }`
  - `createdAt` date string

This keeps the UI unchanged while your backend/AI computes the results.

---

## 7) Customization
### Colors and Theme
- Tailwind is already set up. You can change or extend colors in `tailwind.config.js` and use utility classes in the JSX.
- Many components use gradients (e.g., `from-fuchsia-500 to-cyan-500`). Swap Tailwind color classes to suit your brand.

### Editing UI Components
- Reusable components live in `src/components/ui/`.
  - `Button.jsx`: tweak variants (primary, outline, fun, etc.).
  - `Card.jsx`: switch between `glass`, `gradient`, or `soft` variants.
  - `Avatar.jsx`: renders initials from the user’s name with colorful backgrounds.
  - `Badge.jsx`: small labels for achievements or statuses.
  - `Progress.jsx`: `ProgressBar` (linear) and `ProgressRing` (circular).
  - `Charts.jsx`: Recharts-based visuals used on the Report page.
  - `Sidebar.jsx`: role-specific navigation with playful icons.

### Add a New Page/Route
1. Create your page component inside `src/pages/YourSection/YourPage.jsx`.
2. Add a new `<Route>` in `src/App.jsx`.
3. If it’s behind a role, wrap it in the `ProtectedRoute` used elsewhere.

---

## 8) Credits
- Built with AI assistance (Cursor + GPT) for rapid prototyping.
- Designed for hackathon demos, education prototypes, and quick stakeholder reviews.

If you need help connecting real APIs, adding a backend, or refining the design for production, you can extend this project step-by-step without rewriting the UI.

# AI Education Platform (React + Vite + Tailwind)

A hackathon-ready, beginner-friendly, API-ready demo for an AI-based education platform with three roles: Student, Teacher, Parent. Uses React Router and Context API with mocked authentication and API calls.

## Features
- Mock auth (no backend): Login/Signup and role-based routing
- Student: Dashboard, Assessment (MCQs), Report with insights
- Teacher: Dashboard with class average and per-student reports
- Parent: Dashboard showing child's reports
- Mocked API in `src/api/api.js`
- TailwindCSS for simple, clean UI

## Tech Stack
- React + Vite
- React Router v6
- Context API
- TailwindCSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the dev server:
```bash
npm run dev
```

3. Open the app at the printed local URL.

## Project Structure
```
src/
  api/
    api.js
  components/
  context/
    AuthContext.jsx
  pages/
    Auth/
      Login.jsx
      Signup.jsx
    Student/
      StudentDashboard.jsx
      Assessment.jsx
      Report.jsx
    Teacher/
      TeacherDashboard.jsx
      StudentReport.jsx
    Parent/
      ParentDashboard.jsx
  App.jsx
  main.jsx
  index.css
```

## Notes
- Data persists in `localStorage` for attempts and auth session.
- To demo Teacher/Parent views, log in with those roles from the login page.
- Assessment questions and all API responses are mocked in `src/api/api.js`.

## Deployment
- This is a pure frontend app. Build with:
```bash
npm run build
```
- Serve the `dist/` folder with any static host.

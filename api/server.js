const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/students');
const parentRoutes = require('./routes/parents');
const teacherRoutes = require('./routes/teachers');
const authRoutes = require('./routes/auth');
const resultRoutes = require('./routes/results');
const assessmentRoutes = require('./routes/assessment');
const aiReportRoutes = require('./routes/aiReports');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/ai-reports', aiReportRoutes);

app.get('/', (req, res) => {
   res.json({
      message: "NeuroLearn API - Ready. Docs: /docs/API_setup.md"
   });
});

app.listen(PORT, () => {
   console.log(`API running at http://localhost:${PORT}`);
});

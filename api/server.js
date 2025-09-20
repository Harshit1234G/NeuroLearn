const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/students');
const parentRoutes = require('./routes/parents');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);

app.get('/', (req, res) => {
   res.json({
      message: "NeuroLearn API - Ready. Docs: /docs/API_setup.md"
   });
});

app.listen(PORT, () => {
   console.log(`API running at http://localhost:${PORT}`);
});

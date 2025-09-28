const db = require('../db/database');

const saveReport = (req, res) => {
  const { session_id, diagnosis, student_report, teacher_report, parent_report, tutor_notes } = req.body;
  
  db.run(`
    INSERT INTO ai_reports (session_id, diagnosis, student_report, teacher_report, parent_report, tutor_notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [session_id, diagnosis, student_report, teacher_report, parent_report, tutor_notes], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to save report' });
    res.status(201).json({ id: this.lastID, session_id });
  });
};

const getReport = (req, res) => {
  const { id } = req.params;
  db.get(`
    SELECT id, session_id, diagnosis, student_report, teacher_report, 
           parent_report, tutor_notes, generated_at
    FROM ai_reports WHERE id = ?
  `, [id], (err, report) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  });
};

module.exports = { saveReport, getReport };

const db = require('../db/database');

// List all teachers
// GET /api/teachers
const getAllTeachers = (req, res) => {
   db.all('SELECT id, teacher_id, name, subject, email FROM teachers', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
   });
};

// Create Teacher
// POST /api/teachers
const createTeacher = (req, res) => {
   const { teacher_id, name, subject, email } = req.body;

   db.run(
      `INSERT INTO teachers (teacher_id, name, subject, email) VALUES (?, ?, ?, ?)`,
      [teacher_id, name, subject, email],
      function(err) {
         if (err) return res.status(400).json({ error: err.message });
         res.status(201).json({ id: this.lastID, teacher_id, name });
      }
   );
};

// GET /api/teachers/:teacher_id
// get single teacher for login
const getTeacherById = (req, res) => {
   const { teacher_id } = req.params;
   db.get(
      `SELECT id, teacher_id, name, subject FROM teachers WHERE teacher_id = ?`,
      [teacher_id],
      (err, row) => {
         if (err) return res.status(500).json({ error: err.message });
         if (!row) return res.status(404).json({ error: "Teacher not found!" });
         res.json(row);
      }
   );
};

module.exports = { getAllTeachers, createTeacher, getTeacherById };

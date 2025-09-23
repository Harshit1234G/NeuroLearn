const db = require('../db/database');

//: List all students {{{
// GET /api/students
const getAllStudents = (req, res) => {
   db.all('SELECT * FROM students', (err, rows) => {
      if (err) return res.status(500).json({ err: err.message });
      res.json(rows);
   });
};
//: }}}

//: Create Student {{{
// POST /api/students
const createStudent = (req, res) => {
   const { scholar_no, name, class: studentClass, section } = req.body;
   db.run(
      `INSERT INTO students (scholar_no, name, class, section) VALUES (?, ?, ?, ?)`, 
      [scholar_no, name, studentClass, section], 
      function(err) {
         if (err) {
            return res.status(400).json({ error: err.message });
         }
         res.status(201).json({ id:this.lastID, scholar_no });
      }
   );
};
//: }}}

//: Login Simulation {{{
// GET /api/students/:scholar_no
const getStudentByScholarNo = (req, res) => {
   const { scholar_no } = req.params;

   db.get(
      'SELECT id, scholar_no, name, class, section FROM students WHERE scholar_no = ?',
      [scholar_no],
      (err, row) => {
         if (err) return res.status(500).json({ error: err.message });
         if (!row) return res.status(404).json({ error: "Student not found" });
         res.json(row);
      }
   );
};
//: }}}

module.exports = { getAllStudents, createStudent, getStudentByScholarNo };

const db = require('../db/database');

const getAllStudents = (req, res) => {
   db.all('SELECT * FROM students', (err, rows) => {
      if (err) return res.status(500).json({ err: err.message });
      res.json(rows);
   });
};

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

module.exports = { getAllStudents, createStudent };

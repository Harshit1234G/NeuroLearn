const db = require('../db/database');

const saveResult = (req, res) => {
   const { student_scholar_no, topic, accuracy } = req.body;

   db.run(
      `INSERT INTO student_results (student_scholar_no, topic, accuracy) VALUES (?, ?, ?)`,
      [student_scholar_no, topic, accuracy],
      function(err) {
         if (err) return res.status(500).json({ error: err.message });
         res.status(201).json({ id: this.lastID });
      }
   );
};

const getResults = (req, res) => {
   const { student_scholar_no } = req.query;

   db.all(
      `SELECT topic, accuracy, attempted_at
      FROM student_results
      WHERE student_scholar_no = ?
      ORDER BY attempted_at DESC`,
      [student_scholar_no],
      (err, rows) => {
         if (err) return res.status(500).json({ error: err.message });
         res.json(rows);
      }
   );
};

module.exports = { saveResult, getResults };

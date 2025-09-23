const db = require('../db/database');

//: List all Parents {{{
// GET /api/parents
const getAllParents = (req, res) => {
   db.all('SELECT * FROM parents', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
   });
};
//: }}}

//: Create Parent {{{
// POST /api/parents
const createParent = (req, res) => {
   const { name, phone, email, student_scholar_no } = req.body;
   
   // Check if student exists first
   db.get(
      'SELECT 1 FROM students WHERE scholar_no = ?', 
      [student_scholar_no],
      (err, student) => {
         if (err) return res.status(500).json({ error: err.message });
         if (!student) return res.status(400).json({ error: 'Student Not Found' });

         db.run(
            'INSERT INTO parents (name, phone, email, student_scholar_no) VALUES (?, ?, ?, ?)',
            [name, phone, email, student_scholar_no],
            function(err) {
               if (err) return res.status(400).json({ error: err.message });
               res.status(201).json({ 
                  id: this.lastID, student_scholar_no
               });
            }
         );
      }
   );
};
//: }}}

//: Login Simulation {{{
// GET /api/parents/:id
const getParentById = (req, res) => {
   const { id } = req.params;
   db.get(
      'SELECT id, name, phone, email, student_scholar_no FROM parents WHERE id = ?',
      [id],
      (err, row) => {
         if (err) return res.status(500).json({ error: err.message });
         if (!row) return res.status(404).json({ error: "Parent not found!" });
         res.json(row);
      }
   );
};
//: }}}

module.exports = { getAllParents, createParent, getParentById };

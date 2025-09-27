const db = require('../db/database');
const bcrypt = require('bcrypt');
const { hashPassword, comparePassword } = require('../utils/hash');

const register = (req, res) => {
   const { role, email, password, name, scholar_no, teacher_id } = req.body;

   bcrypt.hash(password, 10, (err, hashed) => {
      if (err) return res.status(500).json({ error: 'Hash Failed' });

      let query, params;

      if (role === 'student') {
         query = `INSERT INTO students (scholar_no, name, email, password) VALUES (?, ?, ?, ?)`;
         params = [scholar_no, name, email, hashed];
      } else if (role === 'teacher') {
          query = `INSERT INTO teachers (teacher_id, name, email, password) VALUES (?, ?, ?, ?)`;
         params = [teacher_id, name, email, hashed];
      } else if (role === 'parent') {
         query = `INSERT INTO parents (name, email, password, student_scholar_no) VALUES (?, ?, ?, ?)`;
         params = [name, email, hashed, scholar_no];
      } else {
         return res.status(400).json({ error: 'Invalid role' });
      }

      db.run(query, params, function(err) {
         if (err) return res.status(400).json({ error: err.message });
         res.status(201).json({ id: this.lastID, role });
      });
   });
};

const login = async (req, res) => {
   const { email, password, role } = req.body;

   let query;
   if (role === 'student') { 
      query = 'SELECT scholar_no as id, password FROM students WHERE email = ?'; 
   } else if (role === 'teacher') {
      query = 'SELECT teacher_id as id, password FROM teachers WHERE email = ?';
   } else if (role === 'parent') {
      query = 'SELECT id, password FROM parents WHERE email = ?';
   } else {
      res.status(400).json({ error: 'Invalid role' });
   }

   db.get(query, [email], async (err, user) => {
      if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

      const match = await comparePassword(password, user.password);

      if (match) {
         // Mock token
         const token = `mock-${role}-${user.id}`;
         res.json({ token, role, id: user.id });
      } else {
         res.status(401).json({ error: 'Invalid password' });
      }
   });
};

module.exports = { register, login };

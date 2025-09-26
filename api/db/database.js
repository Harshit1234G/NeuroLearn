const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../db/neurolearn.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
   if (err) console.error('DB error: ', err.message);
   else console.log('Connected to DB');
});

// Auto run DB on everystart
const schema = `
   PRAGMA foreign_keys = ON;

   CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scholar_no TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      class TEXT,
      section TEXT,
      password TEXT
   );

   CREATE TABLE IF NOT EXISTS parents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      student_scholar_no TEXT NOT NULL,
      password TEXT,
      FOREIGN KEY (student_scholar_no) REFERENCES students(scholar_no) ON DELETE CASCADE
   );

   CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subject TEXT,
      email TEXT,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS student_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_scholar_no TEXT NOT NULL,
      topic TEXT NOT NULL,
      accuracy REAL NOT NULL, -- eg 85.5, 99.9
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_scholar_no) REFERENCES students(scholar_no)
   );

`;

db.exec(schema);

module.exports = db;

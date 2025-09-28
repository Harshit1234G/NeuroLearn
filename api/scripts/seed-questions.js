const fs = require('fs');
const path = require('path');
const db = require('../db/database');

const csv = fs.readFileSync(path.resolve(__dirname, '../../db/percentages_dataset.csv'), 'utf8');
const lines = csv.split('\n').slice(1); // skip header

lines.forEach(line => {
  if (!line.trim()) return;
  const cols = line.split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1'));
  const [id, question_text, option_a, option_b, option_c, option_d, answer, difficulty, tags] = cols;

  db.run(
    `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [question_text, option_a, option_b, option_c, option_d, answer.toLowerCase(), difficulty, tags],
    (err) => {
      if (err) console.log(`❌ Q${id}:`, err.message);
    }
  );
});

console.log('✅ Questions seeded');

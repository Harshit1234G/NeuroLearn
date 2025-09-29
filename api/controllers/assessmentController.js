const db = require('../db/database');

// Helper: Map numeric level to difficulty text
const getDifficultyText = (level) => {
  if (level <= 2) return 'Very easy';
  if (level <= 5) return 'Easy';
  if (level <= 8) return 'Moderate';
  return 'High';
};

// Start or resume assessment
const startAssessment = (req, res) => {
  const { student_scholar_no, topic } = req.body;

  if (!student_scholar_no || !topic) {
    return res.status(400).json({ error: 'student_scholar_no and topic required' });
  }

  // Always get the latest session (active OR completed)
  db.get(
    `SELECT id, completed FROM assessment_sessions 
     WHERE student_scholar_no = ? AND topic = ?
     ORDER BY created_at DESC LIMIT 1`,
    [student_scholar_no, topic],
    (err, lastSession) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      // If no session exists → create new
      if (!lastSession) {
        return db.run(
          `INSERT INTO assessment_sessions (student_scholar_no, topic) VALUES (?, ?)`,
          [student_scholar_no, topic],
          function(err) {
            if (err) return res.status(500).json({ error: 'Session creation failed' });
            res.status(201).json({ sessionId: this.lastID, message: 'Assessment started' });
          }
        );
      }

      // If last session is completed → create new session
      if (lastSession.completed) {
        return db.run(
          `INSERT INTO assessment_sessions (student_scholar_no, topic) VALUES (?, ?)`,
          [student_scholar_no, topic],
          function(err) {
            if (err) return res.status(500).json({ error: 'New session creation failed' });
            res.status(201).json({ sessionId: this.lastID, message: 'New assessment started' });
          }
        );
      }

      // Resume active session
      res.json({ sessionId: lastSession.id, message: 'Resumed existing session' });
    }
  );
};

// Get next question
const getNextQuestion = (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  db.get(
    `SELECT id, student_scholar_no, topic, current_difficulty, completed 
     FROM assessment_sessions WHERE id = ?`,
    [sessionId],
    (err, session) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!session) return res.status(404).json({ error: 'Session not found' });
      if (session.completed) return res.json({ completed: true });

      db.all(
        `SELECT question_id FROM assessment_responses WHERE session_id = ?`,
        [sessionId],
        (err, responses) => {
          if (err) return res.status(500).json({ error: 'Response fetch failed' });
          if (responses.length >= 10) {
            db.run(`UPDATE assessment_sessions SET completed = 1 WHERE id = ?`, [sessionId]);
            return res.json({ completed: true });
          }

          const answeredIds = responses.map(r => r.question_id);
          const difficultyText = getDifficultyText(session.current_difficulty);

          const notInClause = answeredIds.length > 0 
            ? `AND id NOT IN (${answeredIds.map(() => '?').join(',')})`
            : '';

          const baseParams = [...answeredIds];

          // 1) Primary: same tag + exact difficulty
          const q1 = `
            SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, tags
            FROM questions
            WHERE tags = ? AND difficulty = ? ${notInClause}
            ORDER BY RANDOM() LIMIT 1
          `;

          const tryFallbacks = () => {
            // 2) Fallback A: same tag, any difficulty
            const q2 = `
              SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, tags
              FROM questions
              WHERE tags = ? ${notInClause}
              ORDER BY RANDOM() LIMIT 1
            `;
            const p2 = [session.topic, ...baseParams];

            db.get(q2, p2, (e2, question2) => {
              if (e2) return res.status(500).json({ error: 'Question fallback failed' });
              if (question2) {
                return res.json({
                  question: question2,
                  sessionId: session.id,
                  questionNumber: responses.length + 1
                });
              }

              // 3) Fallback B: any tag, any difficulty
              const q3 = `
                SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, tags
                FROM questions
                WHERE 1=1 ${notInClause}
                ORDER BY RANDOM() LIMIT 1
              `;
              const p3 = [...baseParams];
              db.get(q3, p3, (e3, question3) => {
                if (e3) return res.status(500).json({ error: 'Question fallback failed' });
                if (!question3) {
                  // No inventory at all → end session early
                  db.run(`UPDATE assessment_sessions SET completed = 1 WHERE id = ?`, [sessionId]);
                  return res.json({ completed: true });
                }
                return res.json({
                  question: question3,
                  sessionId: session.id,
                  questionNumber: responses.length + 1
                });
              });
            });
          };

          const p1 = [session.topic, difficultyText, ...baseParams];
          db.get(q1, p1, (e1, question1) => {
            if (e1) return res.status(500).json({ error: 'Question fetch failed' });
            if (question1) {
              return res.json({
                question: question1,
                sessionId: session.id,
                questionNumber: responses.length + 1
              });
            }
            // No match at exact difficulty → attempt fallbacks mirroring agent
            tryFallbacks();
          });
        }
      );
    }
  );
};

// Submit answer with adaptive difficulty
const submitAnswer = (req, res) => {
  const { sessionId, questionId, studentAnswer } = req.body;

  if (!sessionId || !questionId || !studentAnswer) {
    return res.status(400).json({ error: 'sessionId, questionId, and studentAnswer required' });
  }

  db.get(
    `SELECT id, current_difficulty, total_score FROM assessment_sessions WHERE id = ? AND completed = 0`,
    [sessionId],
    (err, session) => {
      if (err) return res.status(500).json({ error: 'Session check failed' });
      if (!session) return res.status(400).json({ error: 'Invalid or completed session' });

      db.get(
        `SELECT correct_option FROM questions WHERE id = ?`,
        [questionId],
        (err, question) => {
          if (err || !question) return res.status(404).json({ error: 'Question not found' });

          const isCorrect = studentAnswer.toLowerCase() === question.correct_option.toLowerCase();
          const points = isCorrect ? 1 : 0;
          const newScore = session.total_score + points;

          // Adaptive difficulty: +2 for correct, -1 for wrong (0-10 range)
          let newDifficulty = session.current_difficulty;
          if (isCorrect) {
            newDifficulty = Math.min(session.current_difficulty + 2, 10);
          } else {
            newDifficulty = Math.max(session.current_difficulty - 1, 0);
          }

          db.run(
            `INSERT INTO assessment_responses (session_id, question_id, student_answer, is_correct) VALUES (?, ?, ?, ?)`,
            [sessionId, questionId, studentAnswer, isCorrect],
            (err) => {
              if (err) return res.status(500).json({ error: 'Failed to save response' });

              db.run(
                `UPDATE assessment_sessions SET total_score = ?, current_difficulty = ? WHERE id = ?`,
                [newScore, newDifficulty, sessionId],
                (err) => {
                  if (err) return res.status(500).json({ error: 'Session update failed' });

                  db.get(
                    `SELECT COUNT(*) as count FROM assessment_responses WHERE session_id = ?`,
                    [sessionId],
                    (err, result) => {
                      if (err) return res.status(500).json({ error: 'Count failed' });
                      const completed = result.count >= 10;
                      if (completed) {
                        db.run(`UPDATE assessment_sessions SET completed = 1 WHERE id = ?`, [sessionId]);
                      }

                      res.json({ 
                        isCorrect, 
                        currentScore: newScore, 
                        completed,
                        nextQuestion: !completed,
                        nextDifficulty: getDifficultyText(newDifficulty)
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

// Get final report
const getReport = (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  db.get(`
    SELECT s.name, ses.topic, ses.total_score, ses.completed
    FROM assessment_sessions ses
    JOIN students s ON ses.student_scholar_no = s.scholar_no
    WHERE ses.id = ?
  `, [sessionId], (err, session) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.completed) return res.status(400).json({ error: 'Assessment not completed' });
    
    // Build assessment_result array from responses joined with questions
    db.all(`
      SELECT 
        q.id AS id,
        q.question_text AS question_text,
        q.option_a AS option_a,
        q.option_b AS option_b,
        q.option_c AS option_c,
        q.option_d AS option_d,
        q.correct_option AS answer,
        q.difficulty AS difficulty,
        q.tags AS tags,
        ar.student_answer AS student_answer,
        ar.is_correct AS is_correct
      FROM assessment_responses ar
      JOIN questions q ON ar.question_id = q.id
      WHERE ar.session_id = ?
      ORDER BY ar.id ASC
    `, [sessionId], (respErr, rows) => {
      if (respErr) return res.status(500).json({ error: 'Responses fetch failed' });

      const assessment_result = rows.map(r => ({
        id: r.id,
        question_text: r.question_text,
        option_a: r.option_a,
        option_b: r.option_b,
        option_c: r.option_c,
        option_d: r.option_d,
        answer: r.answer,
        difficulty: r.difficulty,
        tags: r.tags,
        student_answer: r.student_answer,
        status: r.is_correct ? 'Correct' : 'Wrong'
      }));

      const diagnosis = session.total_score >= 7 
        ? "Strong grasp of concepts" 
        : "Needs more practice on complex problems";

      res.json({
        student: session.name,
        topic: session.topic,
        score: session.total_score,
        diagnosis,
        recommendations: "Practice more questions on this topic",
        student_report: `# Hey ${session.name}!\nYou scored ${session.total_score}/10 on ${session.topic}. ${diagnosis}`,
        teacher_report: `# ${session.name}'s Report\nScore: ${session.total_score}/10\n${diagnosis}`,
        parent_report: `Dear Parent, ${session.name} scored ${session.total_score}/10. ${diagnosis}`,
        // Added for DiagnosticAgent consumption
        assessment_result,
        total_score: session.total_score
      });
    });
  });
};

module.exports = { startAssessment, getNextQuestion, submitAnswer, getReport };

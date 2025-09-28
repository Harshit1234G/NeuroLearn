const express = require('express');
const router = express.Router();
const { startAssessment, getNextQuestion, submitAnswer, getReport } = require('../controllers/assessmentController');

router.post('/start', startAssessment);
router.get('/question/:sessionId', getNextQuestion);
router.post('/answer', submitAnswer);
router.get('/report/:sessionId', getReport);

module.exports = router;

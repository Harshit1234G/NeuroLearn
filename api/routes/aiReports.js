const express = require('express');
const router = express.Router();
const { saveReport, getReport } = require('../controllers/aiReportController');

router.post('/', saveReport);      // For AI dev
router.get('/:id', getReport);     // For UI

module.exports = router;

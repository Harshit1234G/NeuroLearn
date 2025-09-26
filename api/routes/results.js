const express = require('express');
const router = express.Router();
const { saveResult, getResults } = require('../controllers/resultController');

router.post('/', saveResult);
router.get('/', getResults);


module.exports = router;

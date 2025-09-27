const express = require('express');
const router = express.Router();
const { getAllStudents, createStudent, getStudentByScholarNo } = require('../controllers/studentController');

router.get('/', getAllStudents);
router.post('/', createStudent);
router.get('/:scholar_no', getStudentByScholarNo);

module.exports = router;

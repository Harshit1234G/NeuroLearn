const express = require('express');
const router = express.Router();
const { getAllTeachers, createTeacher, getTeacherById } = require('../controllers/teacherController');

router.get('/', getAllTeachers);
router.post('/', createTeacher);
router.get('/:teacher_id', getTeacherById);

module.exports = router;

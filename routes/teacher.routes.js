const express = require('express');
const teacherController = require('../controllers/teacher.controller.js');

const router = express.Router();

router.route('/:teacherID').get(teacherController.getTeacher); // get teacher information for form

router.route('/create').post(teacherController.addTeacher); // add teacher to database

router.param('teacherID', teacherController.teacherByID); // get teacher by id

module.exports = router;

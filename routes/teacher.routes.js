const express = require('express');
const teacherController = require('../controllers/teacher.controller.js');

const router = express.Router();

router.route('/:pencilId').get(teacherController.getTeacher); // get teacher information for form

router.route('/create').post(teacherController.addTeacher); // add teacher to database

router.param('pencilId', teacherController.teacherByID); // get teacher by id

module.exports = router;

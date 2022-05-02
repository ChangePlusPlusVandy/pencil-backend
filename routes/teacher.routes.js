const express = require('express');
const teacherController = require('../controllers/teacher.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.route('/:pencilId').get(teacherController.getTeacher); // get teacher information for form

router
  .route('/create')
  .post(authController.requireLogin, teacherController.addTeacher); // add teacher to database

router.param('pencilId', teacherController.teacherByID); // get teacher by id

module.exports = router;

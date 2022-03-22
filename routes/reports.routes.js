const express = require('express');
const reportController = require('../controllers/reports.controller.js');
const teacherController = require('../controllers/teacher.controller.js');

const router = express.Router();

router.route('/report1').post(reportController.report1); // report 1

module.exports = router;

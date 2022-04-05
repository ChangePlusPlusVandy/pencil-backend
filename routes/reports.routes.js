const express = require('express');
const reportController = require('../controllers/reports.controller.js');
const teacherController = require('../controllers/teacher.controller.js');

const router = express.Router();

router
  .route('/report1')
  .get(reportController.getTransaction, reportController.report1); // report 1

router
  .route('/report4')
  .get(reportController.getTransaction, reportController.report4); // report 4

router
  .route('/report5')
  .get(reportController.getTransaction, reportController.report5); // report 5

module.exports = router;

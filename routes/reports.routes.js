const express = require('express');
const reportController = require('../controllers/reports.controller.js');
const teacherController = require('../controllers/teacher.controller.js');

const router = express.Router();

router
  .route('/report1')
  .get(reportController.getTransaction, reportController.report1); // Report 1

router
  .route('/report2')
  .get(reportController.getTransaction, reportController.report2); // Report 2

router
  .route('/report5')
  .get(reportController.getTransaction, reportController.report5); // report 5

module.exports = router;

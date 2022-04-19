const express = require('express');
const reportController = require('../controllers/reports.controller.js');

const router = express.Router();

router
  .route('/report1')
  .get(
    reportController.getTransaction,
    reportController.report1,
    reportController.returnReport
  ); // Report 1

router
  .route('/printReport1')
  .get(
    reportController.getTransaction,
    reportController.report1,
    reportController.printReport1
  );

router
  .route('/report4')
  .get(reportController.getTransaction, reportController.report4); // report 4

router
  .route('/printReport4')
  .get(
    reportController.getTransaction,
    reportController.report4,
    reportController.printReport4
  );

router
  .route('/report5')
  .get(reportController.getTransaction, reportController.report5); // report 5

module.exports = router;

const express = require('express');
const dashboardController = require('../controllers/dashboard.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router
  .route('/dailystats')
  .get(authController.requireLogin, dashboardController.getDailyStats);
router
  .route('/yearlystats')
  .get(authController.requireLogin, dashboardController.getYearlyStats);

module.exports = router;

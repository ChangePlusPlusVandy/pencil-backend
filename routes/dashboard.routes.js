const express = require('express');
const dashboardController = require('../controllers/dashboard.controller.js');

const router = express.Router();

router.route('/dailystats').get(dashboardController.getDailyStats);
router.route('/yearlystats').get(dashboardController.getYearlyStats);

module.exports = router;

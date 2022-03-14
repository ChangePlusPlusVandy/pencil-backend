const express = require('express');
const schedulerController = require('../controllers/scheduler.controller.js');

const router = express.Router();

router.route('/getSchedule/:location').get(schedulerController.getSchedule);
router.param('location', schedulerController.locationParam);

module.exports = router;

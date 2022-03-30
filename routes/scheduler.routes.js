const express = require('express');
const schedulerController = require('../controllers/scheduler.controller.js');

const router = express.Router();

router.route('/getSchedule/:location').get(schedulerController.getSchedule);
router.route('/addAppointment').post(schedulerController.addAppointment);
router.param('location', schedulerController.locationParam);

module.exports = router;

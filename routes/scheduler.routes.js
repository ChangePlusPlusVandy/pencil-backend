const express = require('express');
const schedulerController = require('../controllers/scheduler.controller.js');
const locationController = require('../controllers/location.controller.js');

const router = express.Router();

router.route('/:location/getSchedule').get(schedulerController.getSchedule);
router.route('/addAppointment').post(schedulerController.addAppointment);
router.param('location', locationController.locationByID);

module.exports = router;

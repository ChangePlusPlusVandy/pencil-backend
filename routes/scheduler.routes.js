const express = require('express');
const schedulerController = require('../controllers/scheduler.controller.js');

const router = express.Router();

router.route('/getSchedule').get(schedulerController.getSchedule);
router.route('/addAppointment').post(schedulerController.addAppointment);

module.exports = router;

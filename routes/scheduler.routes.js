const express = require('express');
const schedulerController = require('../controllers/scheduler.controller.js');
const locationController = require('../controllers/location.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router
  .route('/:location/getSchedule')
  .get(authController.requireLogin, schedulerController.getSchedule);
router
  .route('/addAppointment')
  .post(authController.requireKey, schedulerController.addAppointment);
router
  .route('/cancelAppointment')
  .post(authController.requireKey, schedulerController.cancelAppointment);

router
  .route('/fakeAppointment')
  .post(authController.requireLogin, schedulerController.fakeAppointment);
router.param('location', locationController.locationByID);

module.exports = router;

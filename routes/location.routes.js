const express = require('express');
const locationController = require('../controllers/location.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.route('/create').post(locationController.addLocation); // add location to database
router.route('/update/:uuid').put(locationController.updateLocation); // update location in database
router.route('/locations').get(locationController.getAllLocations); // get all locations from database

module.exports = router;

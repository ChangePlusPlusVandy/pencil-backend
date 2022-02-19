import express from 'express';
import locationController from '../controllers/location.controller.js';

const router = express.Router();

router.route('/create').post(locationController.addLocation); // add teacher to database
router.route('/locations').get(locationController.getAllLocations); // add teacher to database

export default router;

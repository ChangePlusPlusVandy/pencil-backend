import express from 'express';
import schedulerController from '../controllers/scheduler.controller.js';

const router = express.Router();

router.route('/getSchedule/:location').get(schedulerController.getSchedule);
router.param('location', schedulerController.locationParam);

export default router;

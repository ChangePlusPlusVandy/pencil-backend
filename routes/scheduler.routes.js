import express from 'express';
import schedulerController from '../controllers/scheduler.controller.js';

const router = express.Router();

router.route('/getOrganizationUri').get(schedulerController.getOrganizationUri);

export default router;

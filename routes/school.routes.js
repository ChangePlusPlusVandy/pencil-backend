const express = require('express');
const schoolController = require('../controllers/school.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.use(authController.requireLogin);

router.route('/').get(schoolController.getSchools);

router.route('/create').post(schoolController.addSchool);

router.route('/update').put(schoolController.updateSchool);

router.route('/verified').get(schoolController.getVerifiedSchools);

module.exports = router;

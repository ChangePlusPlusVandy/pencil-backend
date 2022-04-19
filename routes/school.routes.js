const express = require('express');
const schoolController = require('../controllers/school.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.route('/schools').get(schoolController.getSchools);

router.route('/create').post(schoolController.addSchool);

module.exports = router;

const express = require('express');
const formController = require('../controllers/supplyForm.controller.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.route('/getShopForm').get(formController.fetchSupplyForm); // fetch Supply Form

router
  .route('/updateSupply')
  .put(authController.requireLogin, formController.updateSupply); // update Supply in shopping form

module.exports = router;

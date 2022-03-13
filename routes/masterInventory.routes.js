const express = require('express');
const inventoryController = require('../controllers/masterInventory.controller.js');

const router = express.Router();

// Add item to the master inventory
router.route('/addItem').post(inventoryController.addItem);

// Check whether a given item is in the master inventory or not
router
  .route('/checkInInv/:itemName-:itemPrice')
  .get(inventoryController.checkForItem);

router.route('/getAllItems').get(inventoryController.getAllItems);

router
  .route('/updateMasterInventory')
  .put(inventoryController.updateMasterInventory);

module.exports = router;

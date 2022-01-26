import express from 'express';
import formController from '../controllers/supplyForm.controller.js';

const router = express.Router();

router.route('/addSupply').post(formController.addSupply); // add Supply to shopping form

router.route('/getShopForm').get(formController.fetchSupplyForm); // fetch Supply Form

router.route('/updateSupply').put(formController.updateSupply);

export default router;

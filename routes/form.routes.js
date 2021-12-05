import express from 'express';
import formController from '../controllers/form.controller.js';

const router = express.Router();

router.route('/addSupply').post(formController.addSupply); // add Supply to shopping form

router.route('/getShopForm').get(formController.fetchShopForm); // fetch Supply Form

router.route('/:teacherID').get(formController.getTeacher); // get teacher information for form

router.param('teacherID', formController.teacherByID); // get teacher by id

router.route('/create').post(formController.addTeacher); // add teacher to database

router.route('/transaction/submit').post(formController.submitTransaction);

router.route('/transaction/approve').post(formController.approveTransaction);

export default router;

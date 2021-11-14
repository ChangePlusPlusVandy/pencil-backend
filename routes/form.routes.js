import express from 'express'
import formController from '../controllers/form.controller.js'

const router = express.Router()

router.route('/:teacherID')
    .get(formController.getTeacher) // get teacher information for form

router.route('/create')
    .post(formController.addTeacher) // add teacher to database

router.param('teacherID', formController.teacherByID) // get teacher by id

router.route('/addSupply')
    .get(formController.addSupply) // add Supply - TESTING ONLY! To be deleted.

router.route('/getShopForm')
    .get(formController.fetchShopForm) // fetch Supply Form

router.route('/transaction/submit')
    .post(formController.submitTransaction)

export default router
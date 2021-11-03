import express from 'express'
import formController from '../controllers/form.controller.js'

const router = express.Router()

router.route('/:teacherID')
    .get(formController.getTeacher)

router.route('/create')
    .post(formController.addTeacher)

router.param('teacherID', formController.teacherByID)

export default router
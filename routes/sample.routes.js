import express from 'express'
import sampleController from '../controllers/sample.controller.js'

const router = express.Router()

router.route('/')
    .get(sampleController.get)

export default router
import express from 'express';
import transactionController from '../controllers/transaction.controller.js';

const router = express.Router();

router
  .route('/transaction/submit')
  .post(transactionController.submitTransaction);

router
  .route('/transaction/approve')
  .post(transactionController.approveTransaction);

export default router;

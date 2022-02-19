import express from 'express';
import transactionController from '../controllers/transaction.controller.js';
import transactionHelper from '../helpers/transaction.helper.js';

const router = express.Router();

router.route('/submit').post(transactionController.submitTransaction); // submit transaction to temp table

router
  .route('/approve/:transactionID')
  .post(transactionController.approveTransaction); // approve transaction from temp table to transaction table

router.route('/transactions').get(transactionController.getAllTransactions); // get all transactions from temp table

router
  .route('/deny/:transactionID')
  .post(transactionController.denyTransaction);

router.route('/:transactionID').get(transactionController.getTransaction); // get one transaction

router.param('transactionID', transactionHelper.transactionByID); // param for transactionID

export default router;

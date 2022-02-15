import express from 'express';
import transactionController from '../controllers/transaction.controller.js';

const router = express.Router();

router
  .route('/transaction/submit')
  .post(transactionController.submitTransaction); // submit transaction to temp table

router
  .route('/transaction/approve')
  .post(transactionController.approveTransaction); // approve transaction from temp table to transaction table

router
  .route('/transaction/pendingTransactions')
  .get(transactionController.getPendingTransactions); // get all transactions from temp table

router
  .route('/transaction/approvedTransactions')
  .get(transactionController.getApprovedTransactions); // get all transactions from temp table

router
  .route('/transaction/deniedTransactions')
  .get(transactionController.getDeniedTransactions); // get all transactions from temp table

router.route('/transaction/deny').post(transactionController.denyTransaction);

router
  .route('/transaction/:transactionID')
  .get(transactionController.getTransaction); // get one transaction

router.param('transactionID', transactionController.transactionByID); // param for transactionID
// eslint-disable-next-line prettier/prettier
router
  .route('/transaction/deny')
  .post(transactionController.denyTransaction); //  deny transaction from temp table to denied table

export default router;

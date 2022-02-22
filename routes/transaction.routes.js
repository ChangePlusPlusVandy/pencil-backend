import express from 'express';
import transactionController from '../controllers/transaction.controller.js';
import transactionHelper from '../helpers/transaction.helper.js';

const router = express.Router();

// submit transaction to temp table
router.route('/submit').post(transactionController.submitTransaction);

// approve transaction from temp table to transaction table
router
  .route('/approve/:transactionID')
  .post(transactionController.approveTransaction);

// deny transaction from temp table to rejected table
router
  .route('/deny/:transactionID')
  .post(transactionController.denyTransaction);

// get all pending transactions from temp table
router.route('/pending').get(transactionController.getAllPendingTransactions);

// get all approved transactions from transaction table
router.route('/approved').get(transactionController.getAllApprovedTransactions);

// get all rejected transactions from rejected table
router.route('/denied').get(transactionController.getAllDeniedTransactions);

// get one transaction from temp table
router.route('/:transactionID').get(transactionController.getTransaction);

// param for transactionID
router.param('transactionID', transactionHelper.transactionByID);

export default router;

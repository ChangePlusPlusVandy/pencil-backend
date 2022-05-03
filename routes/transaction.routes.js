const express = require('express');
const transactionController = require('../controllers/transaction.controller.js');
const { transactionByID } = require('../helpers/transaction.helper.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

// submit transaction to temp table
router.route('/submit').post(transactionController.submitTransaction);

// approve transaction from temp table to transaction table
router
  .route('/approve/:transuuid')
  .post(authController.requireLogin, transactionController.approveTransaction);

// deny transaction from temp table to rejected table
router
  .route('/deny/:transuuid')
  .post(authController.requireLogin, transactionController.denyTransaction);

// get all pending transactions from temp table
router
  .route('/pending')
  .get(
    authController.requireLogin,
    transactionController.getAllPendingTransactions
  );

// get all approved transactions from transaction table
router
  .route('/approved')
  .get(
    authController.requireLogin,
    transactionController.getAllApprovedTransactions
  );

// get all rejected transactions from rejected table
router
  .route('/denied')
  .get(
    authController.requireLogin,
    transactionController.getAllDeniedTransactions
  );

// approve denied transaction and update amount of items taken
router
  .route('/approveDenied/:transuuid')
  .post(
    authController.requireLogin,
    transactionController.approveDeniedTransaction
  );

// get one transaction from temp table
// router
//   .route('/:transuuid')
//   .get(transactionController.getTransaction);

// param for _transactionId
router.param('transuuid', transactionByID);

module.exports = router;

const { v4 } = require('uuid');
const { Transaction, Teacher, TransactionItem } = require('../models');
const { formatTransactions } = require('../helpers/transaction.helper.js');

/**
 * Submits a User Transaction and adds data to the Temp Transaction Table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
const submitTransaction = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { pencilId: req.body.teacherId },
    });
    const transaction = await Transaction.create({
      teacherId: teacher.id,
      schoolId: req.body.schoolId,
      locationId: req.location.id,
    });
    req.body.items.forEach(async (item) => {
      const newItem = await TransactionItem.create({
        transactionId: transaction.id,
        itemId: item.itemId,
        maxLimit: item.maxLimit,
        amountTaken: item.itemCount,
      });
    });
    if (!transaction) {
      console.log('Transaction Info not added.');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(transaction);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Submit Transaction - cant submit' });
  }
};

/**
 * Transfers transaction from temporary transaction table (tempTransactionTable) to the final
 * transaction table, deleting the entry in the former table in the process.
 *
 * @param {Object} req - Request Object with structure { id: INT }
 * @param {Object} res - Response Object
 */
const approveTransaction = async (req, res) => {
  try {
    const finalTransaction = await Transaction.update(
      { status: 1 },
      { where: { id: req.body.transaction.id } }
    );

    return res.status(200).json({ status: 'Record approved' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Transfers transaction from temporary transaction table (tempTransactionTable) to the rejected
 * transaction table, deleting the entry in the former table in the process.
 *
 * @param {Object} req - Request Object with structure { id: STRING }
 * @param {Object} res - Response Object
 */
const denyTransaction = async (req, res) => {
  try {
    const finalTransaction = await Transaction.update(
      { status: 2 },
      { where: { id: req.body.transaction.id } }
    );

    return res.status(200).json({ status: 'Record denied' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Returns all pending transactions from temp transaction table.
 *
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object with populated array of pending transactions
 */
const getAllPendingTransactions = async (req, res) => {
  try {
    const curPage = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const transactions = await Transaction.findAll({
      where: { locationId: req.location.id, status: 0 },
      limit: perPage,
      offset: perPage * (curPage - 1),
      include: [
        {
          model: TransactionItem,
        },
        {
          model: Teacher,
        },
      ],
    });
    const formattedTransactions = formatTransactions(transactions);
    return res.status(200).json(formattedTransactions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Returns all approved transactions from transaction table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object with populated array of approved transactions
 */
const getAllApprovedTransactions = async (req, res) => {
  try {
    const curPage = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const transactions = await Transaction.findAll({
      where: { locationId: req.location.id, status: 1 },
      limit: perPage,
      offset: perPage * (curPage - 1),
      include: [
        {
          model: TransactionItem,
        },
        {
          model: Teacher,
        },
      ],
    });
    return res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Returns all rejected transactions from rejected transaction table.
 * @param {Object} req - Request object
 * @param {Object} res - Response object with populated array of rejected transactions
 */
const getAllDeniedTransactions = async (req, res) => {
  try {
    const curPage = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const transactions = await Transaction.findAll({
      where: { locationId: req.location.id, status: 2 },
      limit: perPage,
      offset: perPage * (curPage - 1),
      include: [
        {
          model: TransactionItem,
        },
        {
          model: Teacher,
        },
      ],
    });
    return res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Gets a transaction profile.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const getTransaction = async (req, res) => {
  try {
    return res.json(req.profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  submitTransaction,
  approveTransaction,
  denyTransaction,
  getAllPendingTransactions,
  getAllApprovedTransactions,
  getAllDeniedTransactions,
  getTransaction,
};

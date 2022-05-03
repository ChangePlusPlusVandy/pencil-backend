/* eslint-disable no-underscore-dangle */
const {
  Transaction,
  Teacher,
  TransactionItem,
  Item,
  School,
} = require('../models');
const { formatTransactions } = require('../helpers/transaction.helper.js');

/**
 * Submits a User Transaction and adds data to the Temp Transaction Table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
// eslint-disable-next-line arrow-body-style
const submitTransaction = async (req, res) => {
  return res.status(400).json({ error: 'Unable to find transaction' });
  // try {
  //   const teacher = await Teacher.findOne({
  //     where: { pencilId: req.body.teacherId },
  //   });
  //   const school = await School.findOne({
  //     where: { uuid: req.body.schoolId },
  //   });
  //   const scheduleItem = await ScheduleItem.findOne({
  //     where: { _teacherId: teacher._id, showed: false },
  //   });
  //   if (scheduleItem) scheduleItem.update({ showed: true });
  //   const transaction = await Transaction.create({
  //     _teacherId: teacher._id,
  //     _schoolId: school._id,
  //     _locationId: req.location._id,
  //   });
  //   req.body.items.forEach(async (item) => {
  //     const findItem = await Item.findOne({
  //       where: { uuid: item['Item.uuid'] },
  //     }); // TODO: Null check
  //     const transactionItem = await TransactionItem.create({
  //       _transactionId: transaction._id,
  //       _itemId: findItem._id,
  //       maxLimit: item.maxLimit,
  //       amountTaken: item.itemCount,
  //     });
  //   });
  //   if (!transaction) {
  //     return res.status(400).json({ error: 'Unable to find transaction' });
  //   }
  //   return res.status(200).json(transaction);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ error: 'Submit Transaction - cant submit' });
  // }
};

/**
 * Transfers transaction from temporary transaction table (tempTransactionTable) to the final
 * transaction table, deleting the entry in the former table in the process.
 *
 * @param {Object} req - Request Object with structure { _id: INT }
 * @param {Object} res - Response Object
 */
const approveTransaction = async (req, res) => {
  try {
    const finalTransaction = await Transaction.findOne({
      where: { uuid: req.params.transuuid },
    });
    await finalTransaction.update({ status: 1 });
    if (req.query.newSchool) {
      const newSchool = await School.findOne({
        where: { name: req.body.schoolName },
      });
      await Teacher.update(
        { _schoolId: newSchool._id },
        {
          where: { _id: finalTransaction._teacherId },
        }
      );
      finalTransaction._schoolId = newSchool._id;
    }

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
 * @param {Object} req - Request Object with structure { _id: STRING }
 * @param {Object} res - Response Object
 */
const denyTransaction = async (req, res) => {
  try {
    await Transaction.update(
      { status: 2 },
      { where: { uuid: req.params.transuuid } }
    );

    return res.status(200).json({ status: 'Record denied' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Approves a denied transaction and updates the amount of items taken in the transaction.
 *
 * @param {Object} req - Request Object with transuuid params and body with items
 * @param {*} res - Response Object
 */
const approveDeniedTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { uuid: req.params.transuuid },
    });
    req.body.items.forEach(async (item) => {
      const findItem = await Item.findOne({
        where: { uuid: item.Item.uuid },
      });
      await TransactionItem.update(
        { amountTaken: item.amountTaken },
        { where: { _transactionId: transaction._id, _itemId: findItem._id } }
      );
    });
    await transaction.update({ status: 1 });
    if (req.query.newSchool) {
      const newSchool = await School.findOne({
        where: { name: req.body.schoolName },
      });
      await Teacher.update(
        { _schoolId: newSchool._id },
        {
          where: { _id: transaction._teacherId },
        }
      );
      transaction._schoolId = newSchool._id;
    }
    return res.status(200).json({ status: 'Record approved' });
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
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const previousItems = parseInt(req.query.previous, 10) || 0;
    const transactions = await Transaction.findAll({
      where: { _locationId: req.location._id, status: 0 },
      limit: perPage,
      offset: previousItems,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: TransactionItem,
          include: [
            {
              model: Item,
              raw: true,
            },
          ],
        },
        {
          model: Teacher,
          include: [
            {
              model: School,
            },
          ],
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
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const previousItems = parseInt(req.query.previous, 10) || 0;
    const transactions = await Transaction.findAll({
      where: { _locationId: req.location._id, status: 1 },
      limit: perPage,
      offset: previousItems,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: TransactionItem,
          include: [
            {
              model: Item,
            },
          ],
        },
        {
          model: Teacher,
          include: [
            {
              model: School,
            },
          ],
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
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const previousItems = parseInt(req.query.previous, 10) || 0;
    const transactions = await Transaction.findAll({
      where: { _locationId: req.location._id, status: 2 },
      limit: perPage,
      offset: previousItems,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: TransactionItem,
          include: [
            {
              model: Item,
            },
          ],
        },
        {
          model: Teacher,
          include: [
            {
              model: School,
            },
          ],
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
  approveDeniedTransaction,
  getAllPendingTransactions,
  getAllApprovedTransactions,
  getAllDeniedTransactions,
  getTransaction,
};

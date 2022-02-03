import {
  connectDB as connectTransactionDB,
  SQTransaction,
} from '../models/transaction-table.js';
import {
  connectDB as connectTempTransactionDB,
  SQTempTransaction,
} from '../models/temp-transaction-table.js';
import {
  connectDB as connectDeniedTransactionDB,
  SQDeniedTransaction,
} from '../models/denied-transaction-table.js';
import transactionByID from '../helpers/transaction.helper.js';

/**
 * Submits a User Transaction and adds data to the Transaction Table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
const submitTransaction = async (req, res) => {
  try {
    await connectTempTransactionDB();
    const infoObj = {
      transactionId: Math.floor(Math.random() * 100), // FIX
      teacherId: req.body.teacherId,
      schoolId: req.body.schoolId,
      items: req.body.items,
    };

    const transaction = await SQTempTransaction.create(infoObj);

    if (!transaction) {
      console.log('Transaction Info not added.');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(infoObj);
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
    // Get transaction from temp table
    const transaction = await transactionByID(req.body.transactionId);

    if (!transaction) {
      console.log('Row not found in temp table');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    await connectTransactionDB();
    const finalTransaction = await SQTransaction.create(transaction.toJSON());

    if (!finalTransaction) {
      console.log('Transaction approval failed');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Delete transaction from temp table
    await connectTempTransactionDB();
    transaction.destroy();

    return res.status(200).json(finalTransaction);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const denyTransaction = async (req, res) => {
  try {
    // Get transaction from temp table
    const transaction = await transactionByID(req.body.transactionId);

    if (!transaction) {
      console.log('Row not found in temp table');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    await connectDeniedTransactionDB();
    const finalTransaction = await SQTransaction.create(transaction.toJSON());

    if (!finalTransaction) {
      console.log('Transaction approval failed');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Delete transaction from temp table
    await connectTempTransactionDB();
    transaction.destroy();

    return res.status(200).json(finalTransaction);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Provides all temporary transactions.
 *
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object with populated array of transactions to approve
 */
const getAllTransactions = async (req, res) => {
  try {
    await connectTempTransactionDB();
    const transactions = await SQTempTransaction.findAll();
    return res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  submitTransaction,
  approveTransaction,
  getAllTransactions,
  denyTransaction,
};

import {
  connectDB as connectTempTransactionDB,
  SQTempTransaction
} from '../models/temp-transaction-table.js';


/**
 * Retrieves a row from the tempTransactionDB, given a transaction ID.
 * @param {Number} id - The ID of the transaction to be retrieved
 * @return {Object} - The transaction corresponding to the specified ID or undefined (its type
 *                    is technically object, but it has the functions of a sequelize instance)
 */
const transactionByID = async (id) => {
  try {
    await connectTempTransactionDB();
    const transaction = await SQTempTransaction.findOne({
      where: {
        transactionId: id,
      }
    });

    return transaction;
  } catch {
    console.log('Could not retrieve transaction from temp table');
  }
};

export default transactionByID;

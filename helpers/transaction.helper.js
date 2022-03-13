const { Transaction } = require('../models');

/**
 * Retrieves a row from the tempTransactionDB, given a transaction ID.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} id - The ID of the transaction to be retrieved
 * @return {Object} - The transaction corresponding to the specified ID or undefined (its type
 *                    is technically object, but it has the functions of a sequelize instance)
 */
// eslint-disable-next-line consistent-return
const transactionByID = async (req, res, next, id) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        transactionId: id,
      },
    })
      .then((data) => {
        if (!data) {
          return res.status(403).json({
            error: 'Invalid transaction ID',
          });
        }
        req.transaction = data;
        return next();
      })
      .catch((err) =>
        res.status(400).json({ error: 'Could not retrieve transaction' })
      );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Could not retrieve transaction' });
  }
};

const dateConverter = (date) => {
  const year = date.slice(0, 4);
  let month = parseInt(date.slice(5, 7), 10);
  const day = parseInt(date.slice(8, 10), 10);
  let hours = parseInt(date.slice(11, 13), 10);
  const minutes = date.slice(14, 16);
  let suffix = 'am';

  switch (month) {
    case 1:
      month = 'Jan';
      break;
    case 2:
      month = 'Feb';
      break;
    case 3:
      month = 'Mar';
      break;
    case 4:
      month = 'Apr';
      break;
    case 5:
      month = 'May';
      break;
    case 6:
      month = 'June';
      break;
    case 7:
      month = 'Jul';
      break;
    case 8:
      month = 'Aug';
      break;
    case 9:
      month = 'Sept';
      break;
    case 10:
      month = 'Oct';
      break;
    case 11:
      month = 'Nov';
      break;
    case 12:
      month = 'Dec';
      break;
    default:
  }

  if (hours > 12) {
    suffix = 'pm';
    hours -= 12;
  }

  return `${day} ${month} ${year}\n${hours}:${minutes} ${suffix}`;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const formatTransactions = (transactions) => {
  const formattedData = [];
  console.log(transactions);
  return transactions;
};

module.exports = { transactionByID, formatTransactions };

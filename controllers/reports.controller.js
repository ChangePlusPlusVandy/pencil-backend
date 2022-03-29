const { Op } = require('sequelize');
const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
} = require('../models');
const { teacherByID } = require('./teacher.controller.js');

// const ExcelJS = require('exceljs/dist/es5');
const teacher = require('../models/teacher');

// eslint-disable-next-line consistent-return
const getTransaction = async (req, res, next) => {
  try {
    const transactionWhereStatement = {};
    if (req.query.startDate && req.query.endDate) {
      transactionWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }
    const schoolWhereStatement = {};
    if (req.query.school) {
      schoolWhereStatement.uuid = req.query.school;
    }

    const transactions = await Transaction.findAll({
      attributes: ['createdAt'],
      where: transactionWhereStatement,
      include: [
        {
          model: TransactionItem,
          include: {
            model: Item,
          },
        },
        {
          model: Teacher,
          attributes: ['firstName', 'lastName', 'email'],
        },
        {
          model: School,
          where: schoolWhereStatement,
        },
      ],
    });

    req.transactions = transactions;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

// Report 1 : - Date shopped,Teacher name,Teacher email,Teacher school,Value of products.
// Elements of list are individual shopping trips by teachers.
const report1 = async (req, res) => {
  // Construct where statement for transaction query according to passed parameters.
  // NOTE : Aidan & Arthur look at these query statements and see if its appropriate.
  console.log('THIS IS THE REQ BODY: ', req.body);
  // eslint-disable-next-line prefer-destructuring
  const transactions = req.transactions;

  const pricedTransactions = transactions.map((transaction) => {
    let cumulativeItemPrice = 0;

    transaction.TransactionItems.forEach((transactionItem) => {
      cumulativeItemPrice +=
        transactionItem.dataValues.Item.dataValues.itemPrice *
        transactionItem.dataValues.amountTaken;
    });

    // eslint-disable-next-line
    transaction.dataValues.totalItemPrice = cumulativeItemPrice;

    console.log('the total price is ', transaction.totalItemPrice);
    console.log('For transaction: ', transaction.TransactionItems);
    console.log('\n\n\n');
    return transaction;
  });

  console.log('THESE ARE THE TRANSACTIONS: ', transactions);

  return res.status(200).json(pricedTransactions);
};

const report5 = async (res, req) => {
  const transactions = req.transactions;

  for (let transaction of transactions) {
    console.log('Dis a transaction', transaction);
  }

  return res.status_code(200);
};

module.exports = {
  report1,
  getTransaction,
  report5,
};

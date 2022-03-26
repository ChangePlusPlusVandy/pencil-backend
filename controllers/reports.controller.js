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

const getTransaction = async (req, res, next) => {
  try {
    let transactions = await Transaction.findAll({
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

// Report 1 : - Date shopped,Teacher name,Teacher email,Teacher school,Value of products.
// Elements of list are individual shopping trips by teachers.
const report1 = async (req, res) => {
  // Construct where statement for transaction query according to passed parameters
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

  try {
    let transactions = await Transaction.findAll({
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

    for (transIndex in transactions) {
      let cumulativeItemPrice = 0;
      for (let item of transactions[transIndex].TransactionItems) {
        cumulativeItemPrice +=
          item.dataValues.Item.dataValues.itemPrice *
          item.dataValues.amountTaken;
      }

      transactions[transIndex].dataValues.totalItemPrice = cumulativeItemPrice;
    }

    return res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  report1,
};

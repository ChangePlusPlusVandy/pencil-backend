const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
} = require('../models');
const { teacherByID } = require('./teacher.controller.js');

const { Op } = require('sequelize');
//const ExcelJS = require('exceljs/dist/es5');
const teacher = require('../models/teacher');

// displayReport1
const report1 = async (req, res) => {
  // Construct where statement for transaction query according to passed parameters
  let transactionWhereStatement = {};
  if (req.query.startDate && req.query.endDate) {
    transactionWhereStatement.createdAt = {
      [Op.between]: [req.query.startDate, req.query.endDate],
    };
  }

  let schoolWhereStatement = {};
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

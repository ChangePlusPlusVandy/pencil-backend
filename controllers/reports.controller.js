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
const { restart } = require('nodemon');

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

// Report 1 : Date shopped,Teacher name,Teacher email,Teacher school,Value of products.
// Elements of list are individual shopping trips by teachers.
const report1 = async (req, res) => {
  // Construct where statement for transaction query according to passed parameters.
  console.log('THIS IS THE REQ BODY: ', req.body);
  
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

    return transaction;
  });

  return res.status(200).json(pricedTransactions);
};

// Report 2.
const report2 = async (req, res) => {
  const report2Summary = {};
  const teacherIDs = [];
  const transactions = req.transactions;

  transactions.forEach((transaction) => {
    const schoolName = transaction.dataValues.School.dataValues.name;
    const teacherID = transaction.dataValues.Teacher.dataValues._id;

    if (report2Summary[schoolName]) {
      report2Summary[schoolName] += 1;
    } else {
      report2Summary[schoolName] = 1;
    }

    teacherIDs.push(teacherID);
  });

  const numUniqueIDs = [...new Set(teacherIDs)].length;
  report2Summary['Unique IDs'] = numUniqueIDs;

  return res.status(200).json(report2Summary);
};

// Report 5.
const report5 = async (req, res) => {
  try {
    const transactions = req.transactions;

    let teacherInfo;
    let teacherData = {};
    transactions.forEach((transaction) => {
      teacherInfo = transaction.Teacher.dataValues;
      // FIXME: ONLY USE UNTIL WE HAVE UUIDs FOR TEACHERS
      let teacherID =
        teacherInfo.firstName +
        '-' +
        teacherInfo.lastName +
        '-' +
        teacherInfo.email;

      if (!(teacherID in teacherData)) {
        teacherData[teacherID] = {
          timesShopped: 1,
          schoolName: transaction.School.dataValues.name,
          firstName: teacherInfo.firstName,
          lastName: teacherInfo.lastName,
        };
      } else {
        teacherData[teacherID].timesShopped += 1;
      }
    });

    return res.status(200).json(teacherData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTransaction,
  report1,
  report2,
  report5,
  getTransaction,
};
/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const { restart } = require('nodemon');
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
const { json } = require('express/lib/response');

// eslint-disable-next-line consistent-return
const getTransaction = async (req, res, next) => {
  try {
    const transactionWhereStatement = { status: 1 };
    if (req.query.startDate && req.query.endDate) {
      transactionWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }

    const schoolWhereStatement = {};
    if (req.query.school) schoolWhereStatement.uuid = req.query.school;

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
          attributes: ['pencilId', 'name', 'email'],
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
  const transactions = req.transactions;
  const teacherIds = [];
  // calculate the total value of all items in the transaction
  const pricedTransactions = transactions.map((transaction) => {
    // push teacher ID to array for summary
    const teacherID = transaction.dataValues.Teacher.dataValues.pencilId;
    teacherIds.push(teacherID);

    // generate total value of transaction
    let cumulativeItemPrice = 0;

    transaction.TransactionItems.forEach((transactionItem) => {
      cumulativeItemPrice +=
        transactionItem.dataValues.Item.dataValues.itemPrice *
        transactionItem.dataValues.amountTaken;
    });

    transaction.dataValues.totalItemPrice = cumulativeItemPrice;

    return transaction;
  });

  // TODO: implement no show rate
  const summary = {
    totalSignups: teacherIds.length,
    numUniqueTeachers: [...new Set(teacherIds)].length,
  };

  return res.status(200).json({ transactions: pricedTransactions, summary });
};

const report4 = async (req, res) => {
  try {
    const transactions = req.transactions;
    const products = await Item.findAll();

    // Create hashmap with stats about each possible product/item
    let productData = {};
    products.forEach((product) => {
      productData[product.itemName] = {
        itemPrice: product.itemPrice,
        numTaken: 0,
        takenByNShoppers: 0,
        numTakenAtMax: 0,
      };
    });

    // If there are no transactions in selected time period return unchanged list of products
    if (transactions.length === 0) {
      return res.status(200).json(productData);
    }

    let numTransactions = 0; // The total number of transactions in specified time period
    let itemName;
    transactions.forEach((transaction) => {
      ++numTransactions;

      transaction.TransactionItems.forEach((transItem) => {
        itemName = transItem.Item.itemName;
        if (itemName in productData) {
          productData[itemName].takenByNShoppers += 1;
          productData[itemName].numTaken += transItem.amountTaken;

          if (transItem.amountTaken >= transItem.maxLimit) {
            productData[itemName].numTakenAtMax += 1;
          }
        } else {
          throw 'item in transaction not in item database';
        }
      });
    });

    let productArr = [];
    for (key in productData) {
      productData[key].totalValueTaken =
        productData[key].itemPrice * productData[key].numTaken;

      productData[key].percentageOfShoppers =
        productData[key].takenByNShoppers / numTransactions;

      productData[key].percentageTakenAtMax =
        productData[key].takenByNShoppers === 0
          ? 0
          : productData[key].numTakenAtMax / productData[key].takenByNShoppers;

      productData[key].itemName = key;

      productArr.push(productData[key]);
    }

    return res.status(200).json(productArr);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

// Report 5.
const report5 = async (req, res) => {
  try {
    const transactions = req.transactions;

    let teacherInfo;
    // eslint-disable-next-line prefer-const
    let teacherData = {};
    transactions.forEach((transaction) => {
      teacherInfo = transaction.Teacher.dataValues;
      // FIXME: ONLY USE UNTIL WE HAVE UUIDs FOR TEACHERS
      // eslint-disable-next-line prefer-const
      let teacherID =
        // eslint-disable-next-line prefer-template
        teacherInfo.name + '-' + teacherInfo.email;

      if (!(teacherID in teacherData)) {
        teacherData[teacherID] = {
          timesShopped: 1,
          schoolName: transaction.School.dataValues.name,
          name: teacherInfo.name,
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
  report4,
  report5,
};

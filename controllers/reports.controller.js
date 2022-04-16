/* eslint-disable no-param-reassign */
const { Op, SequelizeScopeError } = require('sequelize');
const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
} = require('../models');
const ExcelJS = require('exceljs');
const fs = require('fs');
const { NULL } = require('mysql/lib/protocol/constants/types');

// eslint-disable-next-line consistent-return
const getTransaction = async (req, res, next) => {
  try {
    const transactionWhereStatement = {
      // FIXME: UNCOMMENT
      //status: 1,
      //_locationId: req.location._id,
    };
    console.log(transactionWhereStatement);
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
const report1 = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const printReport1 = async (req, res, next) => {
  try {
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

    const reportWorkbook = new ExcelJS.Workbook();
    const sheet = reportWorkbook.addWorksheet('report1');

    sheet.columns = [
      { header: 'Date Shopped', key: 'dateShopped', width: 15 },
      { header: 'Teacher Name', key: 'teacherName', width: 25 },
      { header: 'Teacher Email', key: 'teacherEmail', width: 25 },
      { header: 'School Name', key: 'schoolName', width: 20 },
      { header: 'Total Value Taken', key: 'totalValTaken', width: 10 },
    ];

    pricedTransactions.forEach((transaction) => {
      sheet.addRow({
        dateShopped: transaction.dataValues.createdAt,
        teacherName: transaction.Teacher.dataValues.name,
        teacherEmail: transaction.Teacher.dataValues.email,
        schoolName: transaction.School.dataValues.name,
        totalValTaken: transaction.dataValues.totalItemPrice,
      });
    });

    // TODO: Make filename dynamic
    const location = './downloads/';
    const filename = 'test.xlsx';
    // FIXME: FILE OUTPUT IS NOT xlsx UNLESS MANUALLY CONVERTED
    await reportWorkbook.xlsx.writeFile(`${location}${filename}`);

    res.redirect(`/report-downloads/${filename}`);

    const wait = async () => {
      console.log('begin');
      let n;
      for (let i = 0; i < 10000000; i++) {
        for (let j = 0; j < 1000; j++) {
          n = ((0.004 * i * j * j) / 15) * 1.12;
        }
      }
      console.log('end');
    };

    //await wait();
    //fs.unlinkSync(filename);

    return;

    return res.status(200).json({ result: 'Report downloaded' });
  } catch (err) {
    return res.status(500).json({ error: 'we dun broke it' });
  }
};

const report4 = async (req, res) => {
  try {
    const transactions = req.transactions;
    const products = await Item.findAll();

    // Create hashmap with stats about each possible product/item
    const productData = {};
    products.forEach((product) => {
      productData[product.itemName] = {
        itemName: product.itemName,
        itemPrice: product.itemPrice,
        numTaken: 0,
        numShoppers: 0,
        numTakenAtMax: 0,
        percentageOfShoppers: 0,
        percentageTakenAtMax: 0,
        totalValueTaken: 0,
      };
    });

    // If there are no transactions in selected time period return unchanged list of products
    if (transactions.length === 0) {
      // convert productData into an array
      const productArray = Object.keys(productData).map(
        (key) => productData[key]
      );
      return res.status(200).json(productArray);
    }

    transactions.forEach((transaction) => {
      transaction.TransactionItems.forEach((transactionItem) => {
        const itemName = transactionItem.Item.itemName;
        productData[itemName].numShoppers += 1;
        productData[itemName].numTaken += transactionItem.amountTaken;

        if (transactionItem.amountTaken >= transactionItem.maxLimit) {
          productData[itemName].numTakenAtMax += 1;
        }
      });
    });

    const numTransactions = transactions.length;
    const productArr = [];
    Object.keys(productData).forEach((productName) => {
      productData[productName].totalValueTaken =
        productData[productName].itemPrice * productData[productName].numTaken;

      // round it to 2 decimal places
      productData[productName].percentageOfShoppers = parseFloat(
        (productData[productName].numShoppers / numTransactions).toFixed(2)
      );

      if (productData[productName].numShoppers !== 0) {
        let percent =
          productData[productName].numTakenAtMax /
          productData[productName].numShoppers;
        // round it to 2 decimal places
        percent = parseFloat(percent.toFixed(2));
        productData[productName].percentageTakenAtMax = percent;
      }

      productArr.push(productData[productName]);
    });

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
  printReport1,
  report4,
  report5,
};

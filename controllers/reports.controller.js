/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
/* eslint-disable spaced-comment */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
const { Op, SequelizeScopeError, fn, col } = require('sequelize');
const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
  ScheduleItem,
} = require('../models');
const ExcelJS = require('exceljs');
const fs = require('fs');
const { NULL } = require('mysql/lib/protocol/constants/types');
const { json } = require('express/lib/response');

// eslint-disable-next-line consistent-return
const getTransaction = async (req, res, next) => {
  try {
    // TODO: Integrate this logic
    // const noShowList = scheduleArr.filter((schedule) => !schedule.showed);
    // const noShowNum = noShowList.length;
    // const totalNumAppointments = scheduleArr.length;

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

    req.reportBody = pricedTransactions;
    req.reportStats = summary;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const printReport1 = async (req, res) => {
  try {
    // Get data from Report 1
    const pricedTransactions = req.reportBody;

    // Initialize excel spreadsheet
    const reportWorkbook = new ExcelJS.Workbook();
    const sheet = reportWorkbook.addWorksheet('report1');

    // Add column headers to excel spreadsheet
    sheet.columns = [
      { header: 'Date Shopped', key: 'dateShopped', width: 15 },
      { header: 'Teacher Name', key: 'teacherName', width: 25 },
      { header: 'Teacher Email', key: 'teacherEmail', width: 25 },
      { header: 'School Name', key: 'schoolName', width: 20 },
      { header: 'Total Value Taken', key: 'totalValTaken', width: 10 },
    ];

    // Iteratively add each row the the spreadsheet
    pricedTransactions.forEach((transaction) => {
      sheet.addRow({
        dateShopped: transaction.dataValues.createdAt,
        teacherName: transaction.Teacher.dataValues.name,
        teacherEmail: transaction.Teacher.dataValues.email,
        schoolName: transaction.School.dataValues.name,
        totalValTaken: transaction.dataValues.totalItemPrice,
      });
    });

    // Append date to end of filename
    let dateString;
    if (req.query.startDate && req.query.endDate) {
      dateString = `from-${req.query.startDate}-${req.query.endDate}`;
    } else {
      dateString = `all-dates-${Math.floor(Date.now() / 1000)}`;
    }

    const filename = `weekly-report-${dateString}`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}.xlsx`
    );
    return reportWorkbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

const report3 = async (req, res) => {
  try {
    // 1. Find all schedule items bewteen date range whose showed is false
    const scheduleWhereStatement = { showed: 0 };
    if (req.query.startDate && req.query.endDate) {
      scheduleWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }

    // 2. Get teacher name and email and school name
    const scheduleArr = await ScheduleItem.findAll({
      attributes: [],
      where: scheduleWhereStatement,
      include: [
        {
          model: Teacher,
          attributes: ['name', 'email'],
          include: [
            {
              model: School,
              attributes: ['name'],
            },
          ],
        },
      ],
      raw: true,
    });

    // 3. Construct the object to return
    const returnedData = {
      noShowNum: scheduleArr.length,
      noShowList: scheduleArr.map((schedule) => ({
        name: schedule['Teacher.name'],
        email: schedule['Teacher.email'],
        school: schedule['Teacher.School.name'],
      })),
    };

    return res.status(200).json(returnedData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

const report4 = async (req, res, next) => {
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

    req.reportBody = productArr;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

const printReport4 = async (req, res) => {
  try {
    // Get data from Report 4
    const productArr = req.reportBody;

    // Initialize excel spreadsheet
    const reportWorkbook = new ExcelJS.Workbook();
    const sheet = reportWorkbook.addWorksheet('report1');

    // TODO: Change header names (potentially)
    // TODO: See if we can format columns (like percent column)
    // Add column headers to excel spreadsheet
    sheet.columns = [
      { header: 'Item Name', key: 'itemName', width: 20 },
      { header: 'Price', key: 'itemPrice', width: 8 },
      { header: 'Number Taken', key: 'numTaken', width: 8 },
      { header: 'Number of Shoppers', key: 'numShoppers', width: 8 },
      {
        header: 'Number of Items Taken at Max',
        key: 'numTakenAtMax',
        width: 10,
      },
      { header: 'Percent of Shoppers', key: 'percentageOfShoppers', width: 5 },
      { header: 'Percent Taken at Max', key: 'percentageTakenAtMax', width: 5 },
      { header: 'Total Value Taken', key: 'totalValTaken', width: 20 },
    ];

    // Iteratively add each row the the spreadsheet
    productArr.forEach((transaction) => {
      sheet.addRow({
        itemName: productArr.itemName,
        itemPrice: productArr.itemPrice,
        numTaken: productArr.numTaken,
        numShoppers: productArr.numShoppers,
        numTakenAtMax: productArr.numTakenAtMax,
        percentageOfShoppers: productArr.percentageOfShoppers,
        percentageTakenAtMax: productArr.percentageTakenAtMax,
        totalValTaken: productArr.totalValueTaken,
      });
    });

    // Append date to end of filename
    let dateString;
    if (req.query.startDate && req.query.endDate) {
      dateString = `from-${req.query.startDate}-${req.query.endDate}`;
    } else {
      dateString = `all-dates-${Math.floor(Date.now() / 1000)}`;
    }

    const location = './downloads/';
    const filename = `product-report-${dateString}`;
    await reportWorkbook.xlsx.writeFile(`${location}${filename}`);

    // Frontend accesses file using filename
    return res.status(200).json({ filename });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Report 5.
const report5 = async (req, res, next) => {
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

    req.reportBody = teacherData;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// FOR ARTHUR TODO: FINISH THIS ONE
const printReport5 = (req, res) => {
  // teacherData = req.reportBody;
  // const reportWorkbook = new ExcelJS.Workbook();
  // const sheet = reportWorkbook.addWorksheet('report5');
  // console.log(teacherData[0]);
  // // teacherData.forEach((teacher) => {
  // // });
  return res.status(500).json({ error: 'PrintReport5 not complete yet' });
};

const returnReport = (req, res) => {
  const reportBody = req.reportBody;
  const reportStats = req.reportStats ? req.reportStats : {};
  console.log({ reportBody, reportStats });

  return res.status(200).json({ reportBody, reportStats });
};

const deleteReportSheet = (req, res, next) => {
  try {
    const filename = req.body.filename;
    fs.unlinkSync(filename);

    return res.status(200).json({ result: 'File deleted' });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ error: 'internal server error' });
  }
};

module.exports = {
  getTransaction,
  report1,
  printReport1,
  report3,
  report4,
  printReport4,
  report5,
  printReport5,
  returnReport,
  deleteReportSheet,
};

/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
/* eslint-disable spaced-comment */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const { Op, SequelizeScopeError, fn, col } = require('sequelize');
const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
  ScheduleItem,
  Schedule,
} = require('../models');
const ExcelJS = require('exceljs');
const fs = require('fs');
const { NULL } = require('mysql/lib/protocol/constants/types');
const { json } = require('express/lib/response');
const { clearLine } = require('readline');
const schedule = require('../models/schedule');

// eslint-disable-next-line consistent-return
const getTransaction = async (req, res, next) => {
  try {
    const transactionWhereStatement = {
      status: 1,
      _locationId: req.location._id,
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
    return res.status(500).send(err.message);
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
      totalValue: pricedTransactions.reduce(
        (acc, transaction) => acc + transaction.dataValues.totalItemPrice,
        0
      ),
    };

    req.reportBody = pricedTransactions;
    req.reportStats = summary;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const printReport1 = async (req, res) => {
  console.log(req);
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

    // Create string for date range
    const startDate =
      req.query.startDate &&
      req.query.startDate.slice(0, req.query.startDate.indexOf('T'));
    const endDate =
      req.query.endDate &&
      req.query.endDate.slice(0, req.query.endDate.indexOf('T'));

    // Append date range string to end of filename
    let dateString;
    if (startDate && endDate) {
      dateString = `FROM-${startDate}-TO-${endDate}`;
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
    return res.status(500).send(err.message);
  }
};

// TODO: Document all reports
const report3 = async (req, res, next) => {
  try {
    const scheduleWhereStatement = {
      _locationId: req.location._id,
    };
    if (req.query.startDate && req.query.endDate) {
      scheduleWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }
    const schedule = await Schedule.findAll({
      include: [
        {
          model: ScheduleItem,
          include: [
            {
              model: Teacher,
              include: [
                {
                  model: School,
                },
              ],
            },
          ],
        },
      ],
      where: scheduleWhereStatement,
      raw: true,
      nest: true,
    });
    console.log(schedule);
    let totalAppointments = 0;
    let noShowNum = 0;
    const noShowList = [];
    schedule.forEach(({ start_date, ScheduleItems: scheduleItem }) => {
      console.log(scheduleItem);
      if (scheduleItem._id) {
        if (!scheduleItem.showed) {
          noShowNum += 1;
          noShowList.push({
            date: start_date,
            name: scheduleItem.Teacher.name,
            email: scheduleItem.Teacher.email,
            school: scheduleItem.Teacher.School.name,
          });
        }
        totalAppointments += 1;
      }
    });
    console.log(noShowNum, totalAppointments);
    const noShowRate = (noShowNum / totalAppointments) * 100;
    return res.status(200).json({
      noShowRate: noShowRate.toFixed(2),
      noShowList,
    });
    // 3. Construct the object to return
//    const returnedData = {
//      noShowNum: scheduleArr.length,
//      noShowList: scheduleArr.map((schedule) => ({
//        name: schedule['Teacher.name'],
//        email: schedule['Teacher.email'],
//        school: schedule['Teacher.School.name'],
//        date: schedule['Schedule.start_date'],
//      })),
//    };
//
//    req.reportBody = returnedData;
//    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const printReport3 = async (req, res) => {
  try {
    // Get data from Report 3
    const returnedData = req.reportBody;

    // Initialize excel spreadsheet
    const reportWorkbook = new ExcelJS.Workbook();
    const sheet = reportWorkbook.addWorksheet('No-Show report');

    sheet.columns = [
      { header: 'Teacher Name', key: 'teacherName', width: 20 },
      { header: 'Teacher Email', key: 'teacherEmail', width: 20 },
      { header: 'School Name', key: 'schoolName', width: 20 },
      { header: 'No-Show Rate', key: 'noShowRate', width: 10 },
    ];

    returnedData.noShowList.forEach((noShow) => {
      sheet.addRow({
        teacherName: noShow.name,
        teacherEmail: noShow.email,
        schoolName: noShow.school,
        noShowNum: null,
      });
    });

    const noShowRateCell = sheet.getCell('D2');
    noShowRateCell.value = returnedData.noShowNum;

    // Create string for date range
    const startDate =
      req.query.startDate &&
      req.query.startDate.slice(0, req.query.startDate.indexOf('T'));
    const endDate =
      req.query.endDate &&
      req.query.endDate.slice(0, req.query.endDate.indexOf('T'));

    // Append date range string to end of filename
    let dateString;
    if (startDate && endDate) {
      dateString = `FROM-${startDate}-TO-${endDate}`;
    } else {
      dateString = `all-dates-${Math.floor(Date.now() / 1000)}`;
    }

    const location = './downloads/';
    const filename = `no-show-report-${dateString}.xlsx`;

    await reportWorkbook.xlsx.writeFile(`${location}${filename}`);

    // Frontend accesses file using filename
    return res.status(200).json({ filename });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
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
    return res.status(500).send(err.message);
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
    productArr.forEach((product) => {
      sheet.addRow({
        itemName: product.itemName,
        itemPrice: product.itemPrice,
        numTaken: product.numTaken,
        numShoppers: product.numShoppers,
        numTakenAtMax: product.numTakenAtMax,
        percentageOfShoppers: product.percentageOfShoppers,
        percentageTakenAtMax: product.percentageTakenAtMax,
        totalValTaken: product.totalValueTaken,
      });
    });

    // Create string for date range
    const startDate =
      req.query.startDate &&
      req.query.startDate.slice(0, req.query.startDate.indexOf('T'));
    const endDate =
      req.query.endDate &&
      req.query.endDate.slice(0, req.query.endDate.indexOf('T'));

    // Append date range string to end of filename
    let dateString;
    if (startDate && endDate) {
      dateString = `FROM-${startDate}-TO-${endDate}`;
    } else {
      dateString = `all-dates-${Math.floor(Date.now() / 1000)}`;
    }

    const location = './downloads/';
    const filename = `product-report-${dateString}.xlsx`;
    await reportWorkbook.xlsx.writeFile(`${location}${filename}`);

    // Frontend accesses file using filename
    return res.status(200).json({ filename });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
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

      if (!teacherData[teacherID]) {
        teacherData[teacherID] = {
          timesShopped: 1,
          schoolName: transaction.School.dataValues.name,
          name: teacherInfo.name,
        };
      } else {
        teacherData[teacherID].timesShopped += 1;
      }
    });

    const teacherArr = [];
    Object.keys(teacherData).forEach((key) =>
      teacherArr.push(teacherData[key])
    );

    req.reportBody = teacherArr;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const printReport5 = async (req, res) => {
  try {
    teacherData = req.reportBody;

    const reportWorkbook = new ExcelJS.Workbook();
    const sheet = reportWorkbook.addWorksheet('report5');
    sheet.columns = [
      { header: 'Teacher Name', key: 'teacherName', width: 20 },
      { header: 'School Name', key: 'schoolName', width: 20 },
      { header: 'Times Shopped', key: 'timesShopped', width: 10 },
    ];

    teacherData.forEach((teacher) => {
      sheet.addRow({
        teacherName: teacher.name,
        schoolName: teacher.schoolName,
        timesShopped: teacher.timesShopped,
      });
    });

    // Create string for date range
    const startDate =
      req.query.startDate &&
      req.query.startDate.slice(0, req.query.startDate.indexOf('T'));
    const endDate =
      req.query.endDate &&
      req.query.endDate.slice(0, req.query.endDate.indexOf('T'));

    // Append date range string to end of filename
    let dateString;
    if (startDate && endDate) {
      dateString = `FROM-${startDate}-TO-${endDate}`;
    } else {
      dateString = `all-dates-${Math.floor(Date.now() / 1000)}`;
    }

    const location = './downloads/';
    const filename = `teacher-visit-report-${dateString}.xlsx`;
    await reportWorkbook.xlsx.writeFile(`${location}${filename}`);

    return res.status(200).json({ filename });
  } catch (err) {
    console.log(err);

    return res.status(500).send(err.message);
  }
};

const returnReport = (req, res) => {
  const reportBody = req.reportBody;
  const reportStats = req.reportStats ? req.reportStats : {};
  console.log({ reportBody, reportStats });

  return res.status(200).json({ reportBody, reportStats });
};

module.exports = {
  getTransaction,
  report1,
  printReport1,
  report3,
  printReport3,
  report4,
  printReport4,
  report5,
  printReport5,
  returnReport,
};

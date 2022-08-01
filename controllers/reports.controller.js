/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
  ScheduleItem,
  Schedule,
} = require('../models');

const CURRENCY_FORMAT = '$#,##0.00;[Red]-$#,##0.00';

// eslint-disable-next-line consistent-return
const getTransaction = async (req, res, next) => {
  try {
    const transactionWhereStatement = {
      status: 1,
      _locationId: req.location._id,
    };
    if (req.query.startDate && req.query.endDate) {
      transactionWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }

    const schoolWhereStatement = {};
    if (req.query.school) schoolWhereStatement.name = req.query.school;

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
    sheet.getColumn(5).numFmt = CURRENCY_FORMAT;

    // Iteratively add each row the the spreadsheet
    pricedTransactions.forEach((transaction) => {
      sheet.addRow({
        dateShopped: new Date(
          transaction.dataValues.createdAt
        ).toLocaleDateString('en-US', {
          timeZone: 'America/Chicago',
        }),
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
const report2 = async (req, res, next) => {
  try {
    const scheduleWhereStatement = {
      _locationId: req.location._id,
    };
    if (req.query.startDate && req.query.endDate) {
      scheduleWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }
    const schoolWhereStatement = {};
    if (req.query.school) schoolWhereStatement.name = req.query.school;
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
                  where: schoolWhereStatement,
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
    const schoolHash = {};
    schedule.forEach(({ ScheduleItems: scheduleItem }) => {
      if (scheduleItem._id && scheduleItem.Teacher._id) {
        const schoolName = scheduleItem.Teacher.School.name;
        if (!(schoolName in schoolHash)) {
          schoolHash[schoolName] = {
            numNoShow: scheduleItem.showed ? 0 : 1,
            teachers: new Set([scheduleItem.Teacher.name]),
            totalTransactions: 1,
          };
        } else {
          const schoolInfo = schoolHash[schoolName];
          const teachersSet = schoolInfo.teachers;
          teachersSet.add(scheduleItem.Teacher.name);
          schoolHash[schoolName] = {
            numNoShow: schoolInfo.numNoShow + (scheduleItem.showed ? 0 : 1),
            teachers: teachersSet,
            totalTransactions: schoolInfo.totalTransactions + 1,
          };
        }
      }
    });
    const schoolsList = [];
    for (const key in schoolHash) {
      if (Object.prototype.hasOwnProperty.call(schoolHash, key)) {
        schoolsList.push({
          school: key,
          numShoppers: schoolHash[key].teachers.size,
          noShowRate:
            schoolHash[key].numNoShow / schoolHash[key].totalTransactions,
        });
      }
    }
    req.reportBody = schoolsList;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const printReport2 = async (req, res) => {
  try {
    // Get data from Report 2
    const returnedData = req.reportBody;

    // Initialize excel spreadsheet
    const reportWorkbook = new ExcelJS.Workbook();
    const sheet = reportWorkbook.addWorksheet('Schools report');

    sheet.columns = [
      { header: 'School', key: 'school', width: 40 },
      { header: 'No. Shoppers', key: 'numShoppers', width: 20 },
      { header: 'No-Show Rate', key: 'noShowRate', width: 20 },
    ];

    returnedData.forEach((noShow) => {
      sheet.addRow({
        school: noShow.school,
        numShoppers: noShow.numShoppers,
        noShowRate: noShow.noShowRate,
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

    const filename = `SchoolsReport.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
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
    const schoolWhereStatement = {};
    if (req.query.school) schoolWhereStatement.name = req.query.school;
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
                  where: schoolWhereStatement,
                },
              ],
            },
          ],
        },
      ],
      order: [['start_date', 'DESC']],
      where: scheduleWhereStatement,
      raw: true,
      nest: true,
    });
    let totalAppointments = 0;
    let noShowNum = 0;
    const noShowList = [];
    schedule.forEach(({ start_date, ScheduleItems: scheduleItem }) => {
      if (scheduleItem._id && scheduleItem.Teacher._id) {
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
    const noShowRate = (noShowNum / totalAppointments) * 100;
    req.reportBody = noShowList;
    req.reportStats = { noShowRate: noShowRate.toFixed(2) };
    next();
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
    ];

    returnedData.forEach((noShow) => {
      sheet.addRow({
        teacherName: noShow.name,
        teacherEmail: noShow.email,
        schoolName: noShow.school,
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

    const filename = `no-show-report-${dateString}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return reportWorkbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
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
    if (!transactions.length) {
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
      { header: 'Percent of Shoppers', key: 'percentageOfShoppers', width: 15 },
      {
        header: 'Percent Taken at Max',
        key: 'percentageTakenAtMax',
        width: 15,
      },
      {
        header: 'Total Value Taken',
        key: 'totalValTaken',
        width: 20,
      },
    ];
    sheet.getColumn(2).numFmt = CURRENCY_FORMAT;
    sheet.getColumn(8).numFmt = CURRENCY_FORMAT;

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
    const filename = `product-report-${dateString}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return reportWorkbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
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
    teacherArr.sort((a, b) => b.timesShopped - a.timesShopped);

    req.reportBody = teacherArr;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const printReport5 = async (req, res) => {
  // try {
  //   teacherData = req.reportBody;

  //   const reportWorkbook = new ExcelJS.Workbook();
  //   const sheet = reportWorkbook.addWorksheet('report5');
  //   sheet.columns = [
  //     { header: 'Teacher Name', key: 'teacherName', width: 20 },
  //     { header: 'School Name', key: 'schoolName', width: 20 },
  //     { header: 'Times Shopped', key: 'timesShopped', width: 10 },
  //   ];

  //   teacherData.forEach((teacher) => {
  //     sheet.addRow({
  //       teacherName: teacher.name,
  //       schoolName: teacher.schoolName,
  //       timesShopped: teacher.timesShopped,
  //     });
  //   });

  //   // Create string for date range
  //   const startDate =
  //     req.query.startDate &&
  //     req.query.startDate.slice(0, req.query.startDate.indexOf('T'));
  //   const endDate =
  //     req.query.endDate &&
  //     req.query.endDate.slice(0, req.query.endDate.indexOf('T'));

  //   // Append date range string to end of filename
  //   let dateString;
  //   if (startDate && endDate) {
  //     dateString = `FROM-${startDate}-TO-${endDate}`;
  //   } else {
  //     dateString = `all-dates-${Math.floor(Date.now() / 1000)}`;
  //   }

  //   const location = './downloads/';
  //   const filename = `teacher-visit-report-${dateString}.xlsx`;
  //   await reportWorkbook.xlsx.writeFile(`${location}${filename}`);

  //   return res.status(200).json({ filename });
  try {
    // Get data from Report 4
    const teacherData = req.reportBody;

    // Initialize excel spreadsheet
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

    const filename = `teachers-report.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return reportWorkbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (err) {
    console.log(err);

    return res.status(500).send(err.message);
  }
};

const returnReport = (req, res) => {
  const reportBody = req.reportBody;
  const reportStats = req.reportStats ? req.reportStats : {};

  return res.status(200).json({ reportBody, reportStats });
};

module.exports = {
  getTransaction,
  report1,
  printReport1,
  report2,
  printReport2,
  report3,
  printReport3,
  report4,
  printReport4,
  report5,
  printReport5,
  returnReport,
};

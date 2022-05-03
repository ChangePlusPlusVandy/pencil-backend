/* eslint-disable consistent-return */
const { Op } = require('sequelize');
const {
  Schedule,
  ScheduleItem,
  Transaction,
  TransactionItem,
  Item,
} = require('../models');

const getDashboardSchedules = async (req, res, next) => {
  try {
    const location = req.location;
    const startDate = req.body.startDate || new Date('2021-01-01 00:00:00');
    const endDate = req.body.endDate || new Date();

    const schedules = await Schedule.findAll({
      where: {
        _locationId: location._id,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      include: [{ model: ScheduleItem }],
    });

    const numAppointments = schedules.reduce(
      (acc, schedule) => acc + schedule.ScheduleItems.length,
      0
    );

    req.schedules = schedules;
    req.numAppointments = numAppointments;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Cannot retrieve scheduled appointments');
  }
};

const getDashboardTransactions = async (req, res, next) => {
  try {
    const location = req.location;
    const startDate = req.query.startDate || new Date('2021-01-01 00:00:00');
    const endDate = req.query.endDate || new Date();

    const transactions = await Transaction.findAll({
      where: {
        _locationId: location._id,
        status: 1,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: TransactionItem,
          include: { model: Item },
        },
      ],
    });

    const totalValue = transactions.reduce(
      (acc, transaction) =>
        acc +
        transaction.TransactionItems.reduce(
          (acc2, transactionItem) =>
            acc2 + transactionItem.amountTaken * transactionItem.Item.itemPrice,
          0
        ),
      0
    );

    req.transactions = transactions;
    req.totalValue = totalValue;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Cannot retrieve dashboard transactions');
  }
};

const getDailyMonthlyStats = async (req, res) => {
  try {
    return res.status(200).json({
      numAppointments: req.numAppointments,
      totalValue: req.totalValue,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Cannot retrieve daily/monthly stats');
  }
};

const getYearlyStats = async (req, res) => {
  try {
    const { transactions, numAppointments, totalValue } = req;

    const averageValue = totalValue / numAppointments;

    // calculate total number of pencils taken
    let numPencil = 0;
    transactions.forEach((transaction) => {
      transaction.TransactionItems.forEach((transactionItem) => {
        if (transactionItem.Item.itemName === 'Pencil')
          numPencil += transactionItem.amountTaken;
      });
    });

    return res.status(200).json({
      totalValue,
      numAppointments,
      averageValue,
      numPencil,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Cannot retrieve yearly stats');
  }
};

module.exports = {
  getDashboardSchedules,
  getDashboardTransactions,
  getDailyMonthlyStats,
  getYearlyStats,
};

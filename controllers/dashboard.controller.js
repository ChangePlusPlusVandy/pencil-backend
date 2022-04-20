const { Op } = require('sequelize');
const {
  Schedule,
  ScheduleItem,
  Transaction,
  TransactionItem,
  Item,
} = require('../models');

const getDailyStats = async (req, res) => {
  try {
    const location = req.location;

    const schedules = await Schedule.findAll({
      where: {
        _locationId: location._id,
        createdAt: {
          [Op.between]: [
            new Date(new Date().setHours(0, 0, 0, 0)),
            new Date(new Date().setHours(23, 59, 59, 999)),
          ],
        },
      },
      include: [
        {
          model: ScheduleItem,
        },
      ],
    });

    const numAppointments = schedules.reduce(
      (acc, schedule) => acc + schedule.ScheduleItems.length,
      0
    );

    return res.status(200).json({
      numAppointments,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const getYearlyStats = async (req, res) => {
  try {
    const location = req.location;

    const schedules = await Schedule.findAll({
      where: {
        _locationId: location._id,
        createdAt: {
          [Op.between]: [new Date(new Date().getFullYear(), 0, 1), new Date()],
        },
      },
      include: [
        {
          model: ScheduleItem,
        },
      ],
    });

    const numAppointments = schedules.reduce(
      (acc, schedule) => acc + schedule.ScheduleItems.length,
      0
    );

    // calculate total value of product taken from all transactions
    const transactions = await Transaction.findAll({
      where: {
        _locationId: location._id,
        status: 1,
        createdAt: {
          [Op.between]: [new Date(new Date().getFullYear(), 0, 1), new Date()],
        },
      },
      include: [
        {
          model: TransactionItem,
          include: {
            model: Item,
          },
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

    const averageValue = totalValue / numAppointments;

    // calculate total number of pencils taken
    let numPencil = 0;
    transactions.forEach((transaction) => {
      transaction.TransactionItems.forEach((transactionItem) => {
        if (transactionItem.Item.itemName === 'Pencil')
          numPencil += transactionItem.amountTaken;
      });
    });
    console.log(totalValue, numAppointments, averageValue, numPencil);

    return res.status(200).json({
      totalValue,
      numAppointments,
      averageValue,
      numPencil,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  getDailyStats,
  getYearlyStats,
};

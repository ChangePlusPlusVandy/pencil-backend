const {
  Teacher,
  Transaction,
  School,
  TransactionItem,
  Item,
} = require('../models');
const { teacherByID } = require('./teacher.controller.js');

const { Op } = require('sequelize');
const teacher = require('../models/teacher');

const report1 = async (req, res) => {
  try {
    let transactions = await Transaction.findAll({
      attributes: ['createdAt'],
      where: {
        createdAt: { [Op.between]: [req.body.startDate, req.body.endDate] },
      },
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
        },
      ],
    });
    //console.log(transactions);

    for (transIndex in transactions) {
      let cumulativeItemPrice = 0;
      for (let item of transactions[transIndex].TransactionItems) {
        cumulativeItemPrice += item.dataValues.Item.dataValues.itemPrice;
      }

      transactions[transIndex].totalItemPrice = cumulativeItemPrice;

      console.log(transactions[trans]);
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

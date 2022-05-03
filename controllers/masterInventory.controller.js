const { v4 } = require('uuid');
const { Item } = require('../models');

/**
 * Check whether a given item is in the master inventory table (TESTING PURPOSES ONLY).
 *
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const checkForItem = async (req, res, next) => {
  try {
    const isInInventory = await Item.findOne({
      where: {
        itemName: req.params.itemName,
        itemPrice: req.params.itemPrice,
      },
    });

    return res.status(200).json({ inInv: isInInventory ? 'true' : 'false' });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/**
 * Add an item to the master inventory (TESTING PURPOSES ONLY)
 *
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const addItem = async (req, res) => {
  try {
    const [item, created] = await Item.findOrCreate({
      where: {
        itemName: req.body.itemName,
      },
      defaults: {
        itemPrice: req.body.itemPrice,
      },
    });
    if (!created) {
      return res.status(400).send('Item already exists');
    }
    return res.status(200).json(item);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const getAllItems = async (req, res) => {
  try {
    const itemList = await Item.findAll({
      order: [['itemName', 'ASC']],
      attributes: ['uuid', 'itemName', 'itemPrice', 'archived'],
    });

    return res.status(200).json(itemList);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const updateMasterInventory = async (req, res) => {
  try {
    await Promise.all(
      req.body.map(async (item) => {
        const [findItem, created] = await Item.findOrCreate({
          where: {
            itemName: item.itemName,
            itemPrice: item.itemPrice,
          },
        });
        if (!created) {
          await findItem.update({
            archived: item.archived,
          });
        }
      })
    );
    return res.status(200).json(req.body);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  addItem,
  checkForItem,
  getAllItems,
  updateMasterInventory,
};

const { v4 } = require('uuid');
const { Item } = require('../models');

/**
 * Check whether a given item is in the master inventory table.
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
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Add an item to the master inventory
 *
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const addItem = async (req, res, next) => {
  try {
    const itemObj = {
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
    };

    const addedItem = await Item.create(itemObj);

    return res.status(200).json(addedItem);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllItems = async (req, res, next) => {
  try {
    const itemList = await Item.findAll({
      order: [['itemName', 'ASC']],
      attributes: ['uuid', 'itemName', 'itemPrice'],
      where: {
        archived: false,
      },
    });

    return res.status(200).json(itemList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMasterInventory = async (req, res, next) => {
  // FIXME: Consult about master inventory
  const responseItem = [];
  try {
    let allItems = await Item.findAll({});
    console.log(allItems);
    req.body.forEach(async (item) => {
      const [findSchedule, created] = await Item.findOrCreate({
        where: {
          uuid: item.uuid,
        },
        defaults: {
          itemName: item.itemName,
          itemPrice: item.itemPrice,
        },
      });
      if (!created) {
        allItems = allItems.filter((i) => i.Item.dataValues.uuid !== item.uuid);
        await findSchedule.update({
          archived: false,
        });
      }
      responseItem.push(findSchedule);
    });
    allItems.forEach(async (item) => {
      await item.update({
        archived: true,
      });
    });
    return res.status(200).json(responseItem);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addItem,
  checkForItem,
  getAllItems,
  updateMasterInventory,
};

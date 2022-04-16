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
    });

    return res.status(200).json(itemList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getArchived = async (req, res, next) => {
  try {
    const archivedItems = await Item.findAll({
      order: [['itemName', 'ASC']],
      attributes: ['uuid', 'itemName', 'itemPrice'],
      where: { archived: true },
    });

    return res.status(200).json(archivedItems);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getActive = async (req, res, next) => {
  try {
    const activeItems = await Item.findAll({
      order: [['itemName', 'ASC']],
      attributes: ['uuid', 'itemName', 'itemPrice'],
      where: { archived: false },
    });

    return res.status(200).json(activeItems);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMasterInventory = async (req, res, next) => {
  // FIXME: Consult about master inventory
  try {
    const wipe = await Item.destroy({
      where: {},
      truncate: true,
    });

    const updatedItems = await Item.bulkCreate(req.body);
    if (!updatedItems) {
      console.log('Items could not be updated');
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json(updatedItems);
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
  getArchived,
  getActive,
};

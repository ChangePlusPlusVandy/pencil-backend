import { v4 as uuidv4 } from 'uuid';
import {
  connectSelectTable as connectMasterInvDB,
  SQMasterInventory,
} from '../models/master-inventory.js';

/**
 * Check whether a given item is in the master inventory table.
 *
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const checkForItem = async (req, res, next) => {
  try {
    await connectMasterInvDB(req.location.name);

    const isInInventory = await SQMasterInventory.findAll({
      where: {
        itemName: req.params.itemName,
        itemPrice: req.params.itemPrice,
      },
    });

    if (isInInventory) {
      return res.status(200).json({ inInv: 'true' });
    }

    return res.status(200).json({ inInv: 'false' });
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
    await connectMasterInvDB(req.location.name);

    const itemObj = {
      itemId: uuidv4(),
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
    };

    const addedItem = await SQMasterInventory.create(itemObj);
    if (!addedItem) {
      console.log('Item could not be added');
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json(addedItem);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllItems = async (req, res, next) => {
  try {
    await connectMasterInvDB(req.location.name);

    const itemList = await SQMasterInventory.findAll({
      order: [['itemName', 'ASC']],
      attributes: ['itemId', 'itemName', 'itemPrice'],
    });

    return res.status(200).json(itemList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMasterInventory = async (req, res, next) => {
  try {
    await connectMasterInvDB(req.location.name);

    const wipe = await SQMasterInventory.destroy({
      where: {},
      truncate: true,
    });

    const updatedItems = await SQMasterInventory.bulkCreate(req.body);
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

export default {
  addItem,
  checkForItem,
  getAllItems,
  updateMasterInventory,
};

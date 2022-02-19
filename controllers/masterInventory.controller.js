import { v4 as uuidv4 } from 'uuid';
import {
  connectDB as connectMasterInvDB,
  SQMasterInventory
} from '../models/master-inventory.js'


/**
 * Check whether a given item is in the master inventory table.
 * 
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const checkForItem = async (res, req, next) => {
  try {
    await connectMasterInvDB();

    const isInInventory = await SQMasterInventory.findAll({
      where: {
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice
      }
    });

    if (isInInventory) {
      return res.status(200).json( { status: 'true' });
    }
    else {
      return res.status(200).json( { status: 'false' } );
    }
  }
  catch (err) {
    return res.status(500).json( { error: 'Internal server error' })
  }
}

/**
 * Add an item to the master inventory
 * 
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const addItem = async (res, req, next) => {
  try {
    await connectMasterInvDB();

    const itemObj = {
      itemId: uuidv4(),
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice
    };

    const addedItem = await SQMasterInventory.create(itemObj);
    if (!addedItem) {
      console.log('Item could not be added')
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json(addedItem);
  }
  catch (err) {
    console.log('Error in addItem');
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default {
  addItem,
  checkForItem
};
  
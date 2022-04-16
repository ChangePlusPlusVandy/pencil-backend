const { v4 } = require('uuid');
const Joi = require('joi');
const { Item } = require('../models');
const { app } = require('../index');

const options = {
  allowUnknown: true,
};

/**
 * Check whether a given item is in the master inventory table.
 *
 * @param {Object} req - Request Object with structure { itemName: STRING, itemPrice: DOUBLE }
 * @param {Object} res - Response Object
 */
const checkForItem = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      itemName: Joi.string().required().max(500),
      itemPrice: Joi.number().required().max(100000000),
    });
    await schema.validateAsync(req.params, options);
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
    console.log('PLEASE');
    const schema = Joi.object().keys({
      itemName: Joi.string().required().max(500),
      itemPrice: Joi.number().required().max(100000000),
    });
    await schema.validateAsync(req.body, options);
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
    const schema = Joi.array().items({
      uuid: Joi.string().length(36),
      itemName: Joi.string().required().max(500),
      itemPrice: Joi.number().required().max(100000000),
    });
    await schema.validateAsync(req.body, options);
    req.body.forEach(async (item) => {
      if (item.archive) {
        const updatedItem = await Item.update(
          { archived: true },
          { where: { uuid: item.uuid } }
        );
        responseItem.push(updatedItem);
      } else if (!item.uuid) {
        const newItem = await Item.create(item);
        responseItem.push(newItem);
      } else {
        const [findSchedule, created] = await Item.findOrCreate({
          where: {
            uuid: item.uuid,
          },
          defaults: {
            itemName: item.itemName,
            itemPrice: item.itemPrice,
          },
        });
        responseItem.push(findSchedule);
      }
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

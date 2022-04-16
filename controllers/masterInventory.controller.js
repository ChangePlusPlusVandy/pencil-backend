const { v4 } = require('uuid');
const Joi = require('joi');
const { Item } = require('../models');
const { app } = require('../index');

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
      itemPrice: Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .max(500),
    });
    await schema.validateAsync(req.params);
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
    const schema = Joi.object().keys({
      itemName: Joi.string().required().max(500),
      itemPrice: Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .max(500),
    });
    await schema.validateAsync(req.body);
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

const updateMasterInventory = async (req, res, next) => {
  // FIXME: Consult about master inventory
  try {
    const schema = Joi.object().keys({
      itemName: Joi.string().required().max(500),
      itemPrice: Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .max(500),
    });
    await schema.validateAsync(req.body);
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
};

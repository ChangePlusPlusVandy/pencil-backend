const { ShoppingForm } = require('../models');

/**
 * Adds a supply to the form database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addSupply = async (req, res) => {
  try {
    const supply = await ShoppingForm.create({
      itemId: req.body.itemId,
      itemName: req.body.itemName,
      maxLimit: req.body.maxLimit,
      itemOrder: req.body.itemOrder,
    });
    if (!supply) {
      console.log('addSupply : Sup empty.');
      return res.status(500).json({ error: 'Could not create supply' });
    }

    return res.status(200).json(supply);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Adds a supply to the form database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const updateSupply = async (req, res) => {
  try {
    console.log(req.body, 'body');
    // const sup = await SQShoppingForm.create({
    //   itemId: req.body.itemId,
    //   itemName: req.body.itemName,
    //   maxLimit: req.body.maxLimit,
    //   itemOrder: req.body.itemOrder,
    // });

    const wipe = await ShoppingForm.destroy({
      where: {},
      truncate: true,
    });

    const sup = await ShoppingForm.bulkCreate(req.body).catch((err) => {
      console.log(err);
    });

    if (!sup) {
      console.log(sup);
      return res.status(500).json({ error: 'Could not create supply' });
    }

    return res.status(200).json(sup);
  } catch (err) {
    console.log("addSupply : can't connect");
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Fetches the Supply Form from supply form table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
const fetchSupplyForm = async (req, res) => {
  try {
    const supplies = await ShoppingForm.findAll({
      attributes: ['itemName', 'maxLimit', 'itemOrder'],
    });

    if (!supplies) {
      console.log('fetchForm - supplies not found..');
      return res.status(400).json({ error: 'No items found' });
    }
    supplies.sort((a, b) => a.itemOrder - b.itemOrder);
    return res.status(200).json(supplies);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addSupply,
  fetchSupplyForm,
  updateSupply,
};

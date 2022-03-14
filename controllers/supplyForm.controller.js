const { ShoppingForm, Item, Location } = require('../models');

/**
 * Adds a supply to the form database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addSupply = async (req, res) => {
  try {
    let item = await Item.findOne({
      where: { itemName: req.body.itemName },
    });
    if (!item) {
      item = await Item.create({
        itemName: req.body.itemName,
        itemPrice: 0,
      });
    }
    const supply = await ShoppingForm.create({
      itemId: item.id,
      locationId: req.location.id,
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
    const responseItem = [];
    const wipe = await ShoppingForm.destroy({
      where: { locationId: req.location.id },
      truncate: true,
    });
    console.log('prev,', wipe);
    req.body.forEach(async (item) => {
      let newItem = await Item.findOne({
        where: { itemName: item['Item.itemName'] },
      });
      if (!newItem) {
        newItem = await Item.create({
          itemName: item['Item.itemName'],
          itemPrice: 0,
        });
      }
      const supply = await ShoppingForm.create({
        itemId: newItem.id,
        locationId: req.location.id,
        maxLimit: item.maxLimit,
        itemOrder: item.itemOrder,
      });
      responseItem.push(supply);
    });

    return res.status(200).json({ message: 'Supply Form Updated' });
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
      where: { locationId: req.location.id },
      raw: true,

      include: [{ model: Item, attributes: ['itemName', 'itemPrice'] }],
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

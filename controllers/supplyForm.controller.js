const { ShoppingFormItem, Item } = require('../models');

/**
 * Adds a supply to the form database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addSupply = async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { itemName: req.body.itemName },
    });

    const supply = await ShoppingFormItem.create({
      _itemId: item._id,
      _locationId: req.location._id,
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
    await ShoppingFormItem.destroy({
      where: { _locationId: req.location._id },
      truncate: true,
    });
    await Promise.all(
      req.body.map(async (item) => {
        let newItem = await Item.findOne({
          where: { itemName: item['Item.itemName'] },
        });
        if (!newItem) {
          newItem = await Item.create({
            itemName: item['Item.itemName'],
            itemPrice: 0,
          });
        }
        const supply = await ShoppingFormItem.create({
          _itemId: newItem._id,
          _locationId: req.location._id,
          maxLimit: item.maxLimit,
          itemOrder: item.itemOrder,
        });
        responseItem.push(supply);
      })
    );

    return res.status(200).json({ message: 'Supply Form Updated' });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/**
 * Fetches the Supply Form from supply form table.
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
const fetchSupplyForm = async (req, res) => {
  try {
    const supplies = await ShoppingFormItem.findAll({
      where: { _locationId: req.location._id },
      raw: true,

      include: [{ model: Item, attributes: ['uuid', 'itemName', 'itemPrice'] }],
    });

    if (!supplies) {
      return res.status(400).send('No supplies were found');
    }
    supplies.sort((a, b) => a.itemOrder - b.itemOrder);
    return res.status(200).json(supplies);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  addSupply,
  fetchSupplyForm,
  updateSupply,
};

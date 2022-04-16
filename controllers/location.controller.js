const Joi = require('joi');
const { Location } = require('../models');

/**
 * Populates profile field with location information.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} name - Location name.
 * @returns {function} - Call to next controller.
 * */
// eslint-disable-next-line consistent-return
const locationByID = async (req, res, next, name) => {
  try {
    const location = await Location.findOne({ where: { name } })
      .then((data) => {
        if (!data) {
          return res.status(400).json({
            error: 'Invalid location ID',
          });
        }
        req.location = data;
        return next();
      })
      .catch((err) =>
        res.status(400).json({
          error: 'Location not found',
        })
      );
  } catch (err) {
    return res.status(400).json({
      error: 'Could not find location',
    });
  }
};

/**
 * Adds a location to the database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addLocation = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required().max(500),
      address: Joi.string().required().max(500),
    });
    await schema.validateAsync(req.body);
    // if location already exists, return error
    const loc = await Location.findOne({
      where: { name: req.body.name },
    });
    if (loc) {
      return res.status(400).json({
        error: 'Location already exists',
      });
    }
    // if location does not exist, add location to database
    const location = await Location.create({
      name: req.body.name,
      address: req.body.address,
    });
    return res.status(200).json(location);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Could not create location',
    });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    console.log(locations);
    return res.status(200).json(locations);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Could not get locations',
    });
  }
};

module.exports = {
  locationByID,
  getAllLocations,
  addLocation,
};

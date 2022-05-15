// We will put all ES lint disables in the beginning for later cleanup.
/* eslint-disable consistent-return */

const { Location } = require('../models');

/**
 * Middleware function that populates location field with location information.
 * Returns a 500 response status if there is an error.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} name - Location name.
 * @returns {function} - Call to next controller.
 */
const locationByID = async (req, res, next, name) => {
  try {
    await Location.findOne({ where: { name } })
      .then((data) => {
        if (!data) {
          return res.status(400).send('Invalid location ID');
        }
        req.location = data;
        return next();
      })
      .catch(() => res.status(400).send('Location not found'));
  } catch (err) {
    return res.status(500).send('Could not retrieve location');
  }
};

/**
 * Function that finds a location attached to the request body and adds that location to the 'Location' database.
 * Returns a 400 response status if the location already exists in the database, and returns a 500 response
 * status if there is an error.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns Response object with location.
 */
const addLocation = async (req, res) => {
  try {
    // if location already exists, return error
    const loc = await Location.findOne({
      where: { name: req.body.name },
    });
    if (loc) {
      return res.status(400).send('Location already exists');
    }
    // if location does not exist, add location to database
    const location = await Location.create({
      name: req.body.name,
      address: req.body.address,
    });
    return res.status(200).json(location);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

/**
 * Function that updates a location information in the 'Location' database. Returns a 400 response status if
 * the location does not exist, and returns a 500 response status if there is an error.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns Response object with location.
 */
const updateLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      where: { uuid: req.body.uuid },
    });
    if (!location) {
      return res.status(400).send('Location not found');
    }

    await location.update({
      name: req.body.name,
      address: req.body.address,
    });
    return res.status(200).json('Location successfully updated');
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

/**
 * Function that retrieves all locations from the 'Location'databse.
 * Returns a 500 response status if there is an error.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns Response object with all locations.
 */
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    return res.status(200).json(locations);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send(
        'Unable to retrieve locations. Please contact the development team.'
      );
  }
};

module.exports = {
  locationByID,
  getAllLocations,
  updateLocation,
  addLocation,
};

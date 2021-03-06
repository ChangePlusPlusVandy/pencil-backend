const { Location } = require('../models');

/**
 * Populates location field with location information.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} name - Location name.
 * @returns {function} - Call to next controller.
 * */
// eslint-disable-next-line consistent-return
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
 * Adds a location to the database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
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
 * Updates a location in the database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
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

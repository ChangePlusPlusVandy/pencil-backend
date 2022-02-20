import {
  connectDB as connectLocationDB,
  SQLocation,
} from '../models/location-table.js';

/**
 * Populates profile field with location information.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} id - Teacher id.
 * @returns {function} - Call to next controller.
 * */
// eslint-disable-next-line consistent-return
const locationByID = async (req, res, next, id) => {
  try {
    await connectLocationDB();
    console.log(id);
    const location = await SQLocation.findOne({ where: { name: id } })
      .then((data) => {
        if (!data) {
          return res.status(403).json({
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
    await connectLocationDB();
    // if location already exists, return error
    const loc = await SQLocation.findOne({
      where: { name: req.body.name },
    });
    if (loc) {
      return res.status(400).json({
        error: 'Location already exists',
      });
    }
    // if location does not exist, add location to database
    const location = await SQLocation.create({
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
    await connectLocationDB();
    const locations = await SQLocation.findAll();
    console.log(locations);
    return res.status(200).json(locations);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Could not get locations',
    });
  }
};

export default {
  locationByID,
  getAllLocations,
  addLocation,
};

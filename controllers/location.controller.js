import {
  connectDB as connectLocationDB,
  SQLocation,
} from '../models/location-table.js';

/**
 * Populates profile field with teacher information.
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
 * Adds a teacher to the database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addLocation = async (req, res) => {
  try {
    await connectLocationDB();
    const location = await SQLocation.create({
      name: req.body.name,
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

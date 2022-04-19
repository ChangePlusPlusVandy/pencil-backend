const { School } = require('../models');

const getSchools = async (req, res) => {
  try {
    const schools = await School.findAll({
      where: {
        verified: true,
      },
    });
    return res.status(200).json({ schools });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Could not retrieve schools',
    });
  }
};

const addSchool = async (req, res) => {
  try {
    const [school, created] = await School.findOrCreate({
      where: {
        name: req.body.name,
      },
    });
    if (!created) {
      return res.status(400).json({
        error: 'School already exists',
      });
    }
    return res.status(200).json({ school });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Could not add school',
    });
  }
};

module.exports = {
  getSchools,
  addSchool,
};

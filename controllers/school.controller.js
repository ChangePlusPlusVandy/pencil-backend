const { School } = require('../models');

const getSchools = async (req, res) => {
  try {
    const schools = await School.findAll({
      where: {
        verified: true,
      },
    });
    return res.status(200).json(schools);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
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
      if (school.verified) {
        return res.status(400).send('School already exists');
      }
      await school.update({
        verified: true,
      });
    }
    return res.status(200).json(school);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
};

const updateSchool = async (req, res) => {
  try {
    const school = await School.findOne({
      where: {
        uuid: req.body.uuid,
      },
    });
    if (!school) {
      return res.status(400).send('School does not exist');
    }
    await school.update({
      name: req.body.name,
    });
    return res.status(200).json(school);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const getVerifiedSchools = async (req, res) => {
  try {
    const schools = await School.findAll({
      where: {
        verified: true,
      },
      attributes: ['uuid', 'name'],
    });
    return res.status(200).json(schools);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getSchools,
  addSchool,
  updateSchool,
  getVerifiedSchools,
};

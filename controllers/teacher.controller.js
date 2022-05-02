const { Teacher, School } = require('../models');

/**
 * Gets a teacher's profile.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const getTeacher = async (req, res) => {
  try {
    return res.json(req.profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Populates profile field with teacher information.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {id} pencilId - Teacher id.
 * @returns {function} - Call to next controller.
 * */
// eslint-disable-next-line consistent-return
const teacherByID = async (req, res, next, pencilId) => {
  try {
    await Teacher.findOne({
      where: { pencilId },
      include: [{ model: School }],
    })
      .then((data) => {
        if (!data) {
          return res.status(400).json({
            error: 'Invalid teacher ID',
          });
        }
        req.profile = data;
        return next();
      })
      .catch((err) =>
        res.status(400).json({
          error: 'Teacher not found',
        })
      );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Could not retrieve teacher',
    });
  }
};

/**
 * Adds a teacher to the database.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * */
const addTeacher = async (req, res) => {
  try {
    console.log('addTeacher:', req);

    // check if teacher already in database
    const data = await Teacher.findOne({
      where: { email: req.body.email },
    });

    if (data) {
      return res.status(400).json({
        teacher: data,
        error: 'Teacher already exists',
      });
    }

    const teacher = await Teacher.create({
      pencilId: req.body.pencilId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      school: req.body.school,
    });

    return res.status(200).json({ teacher });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Could not create teacher',
    });
  }
};

module.exports = {
  getTeacher,
  teacherByID,
  addTeacher,
};

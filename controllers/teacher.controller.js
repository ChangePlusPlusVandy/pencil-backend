import {
  connectDB as connectTeachersDB,
  SQTeacher,
} from '../models/teacher-table.js';

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
 * @param {id} id - Teacher id.
 * @returns {function} - Call to next controller.
 * */
// eslint-disable-next-line consistent-return
const teacherByID = async (req, res, next, id) => {
  try {
    await connectTeachersDB();
    console.log(id);
    const teacher = await SQTeacher.findOne({ where: { teacherkey: id } })
      .then((data) => {
        if (!data) {
          return res.status(403).json({
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
    return res.status(400).json({
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
    console.log(req.body);
    await connectTeachersDB();
    const teacher = await SQTeacher.create({
      teacherkey: req.body.teacherkey,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      schoolId: req.body.schoolId,
    });

    if (!teacher) {
      return res.status(400).json({
        error: 'Teacher not found',
      });
    }
    return res.status(200).json(teacher);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Could not create teacher',
    });
  }
};

export default {
  getTeacher,
  teacherByID,
  addTeacher,
};

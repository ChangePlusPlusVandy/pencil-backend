/* eslint-disable no-underscore-dangle */
const fetch = require('cross-fetch');
const { Op } = require('sequelize');
const {
  Teacher,
  Schedule,
  ScheduleItem,
  Location,
  School,
} = require('../models');

/**
 * Gets all appointments scheduled by teachers
 *
 * @param req - Express request object with the following params:
 *                req.query.startDate - start date of the schedule
 *                                      (i.e., the lower bound of scheduled appointments to fetch)
 *                req.query.end_date - end date of the schedule (the upper bound)
 * @param res - Express response object
 * @returns response object with status code and schedule data if successful. Returned data contains
 *          a list of scheduleItems, each of which contains all appointments for a given timeslot
 */
const getSchedule = async (req, res) => {
  try {
    const scheduleWhereStatement = {
      _locationId: req.location._id,
    };
    if (req.query.startDate && req.query.endDate) {
      scheduleWhereStatement.createdAt = {
        [Op.between]: [req.query.startDate, req.query.endDate],
      };
    }
    const schedule = await Schedule.findAll({
      include: [
        {
          separate: true,
          model: ScheduleItem,
          include: [
            {
              model: Teacher,
              include: [
                {
                  model: School,
                },
              ],
            },
          ],
        },
      ],
      where: scheduleWhereStatement,
    });
    console.log(schedule);

    return res.status(200).json(schedule);
  } catch (err) {
    console.log(err);
    return { err: 'Error getting schedule' };
  }
};

/**
 * @param req --
 */
const addAppointment = async (req, res) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
      },
    };
    const event = await fetch(req.body.payload.event, options).then(
      (response) => response.json()
    );
    const location = await Location.findOne({
      name: event.resource.name,
    });

    const [findSchedule] = await Schedule.findOrCreate({
      where: {
        start_date: event.resource.start_time,
        end_date: event.resource.end_time,
        _locationId: location._id,
      },
    });

    const [findSchool] = await School.findOrCreate({
      where: {
        name: req.body.payload.questions_and_answers[0].answer, // FIX BASED ON ACTUAL FORM
      },
      defaults: {
        verified: false,
      },
    });

    const [findTeacher] = await Teacher.findOrCreate({
      where: {
        email: req.body.payload.email,
      },
      defaults: {
        name: req.body.payload.name,
        phone: req.body.payload.questions_and_answers[1].answer, // FIX BASED ON ACTUAL FORM
        _schoolId: findSchool._id,
      },
    });
    findTeacher.update({
      pencilId: findTeacher._id,
    });
    const newScheduleItem = await ScheduleItem.create({
      _scheduleId: findSchedule._id,
      _teacherId: findTeacher._id,
    });

    return res.status(204);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: 'Error adding appointment' });
  }
};

const cancelAppointment = async (req, res) => {
  console.log(req.body.payload);
  try {
    return res.status(204);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: 'Error canceling appointment' });
  }
};

const fakeAppointment = async (req, res) => {
  try {
    const location = await Location.findOne({
      name: req.body.location,
    });
    const [findSchedule] = await Schedule.findOrCreate({
      where: {
        start_date: req.body.start_time,
        end_date: req.body.end_time,
        _locationId: location._id,
      },
    });

    const [findSchool] = await School.findOrCreate({
      where: {
        name: req.body.school, // FIX BASED ON ACTUAL FORM
      },
      defaults: {
        verified: false,
      },
    });

    const [findTeacher] = await Teacher.findOrCreate({
      where: {
        email: req.body.teacher.email,
      },
      defaults: {
        name: req.body.teacher.name,
        phone: req.body.teacher.phone, // FIX BASED ON ACTUAL FORM
        _schoolId: findSchool._id,
      },
    });
    findTeacher.update({
      pencilId: findTeacher._id,
    });
    const newScheduleItem = await ScheduleItem.create({
      _scheduleId: findSchedule._id,
      _teacherId: findTeacher._id,
    });

    return res.status(200).json({
      message: 'Successfully added fake appointment',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: 'Error adding appointment' });
  }
};

module.exports = {
  addAppointment,
  cancelAppointment,
  getSchedule,
  fakeAppointment,
};

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

const addAppointment = async (req, res) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
      },
    };
    const eventInfo = await fetch(req.body.payload.event, options);
    const event = await eventInfo.json();
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

    return res.status(200).json({ message: 'Appointment added' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: 'Error adding appointment' });
  }
};

const cancelAppointment = async (req, res) => {
  console.log(req.body);
  return req;
};

module.exports = {
  addAppointment,
  cancelAppointment,
  getSchedule,
};

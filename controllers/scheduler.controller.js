/* eslint-disable no-underscore-dangle */
const fetch = require('cross-fetch'); // FIXXXX
const {
  Teacher,
  Schedule,
  ScheduleItem,
  Location,
  School,
} = require('../models');

const addTeacher2 = async (teacherObj) => {
  try {
    console.log('addTeacher:', teacherObj);

    // check if teacher already in database
    const data = await Teacher.findOne({
      where: { email: teacherObj.email },
    });

    if (data) {
      return {
        teacher: data,
        error: 'Teacher already exists',
      };
    }

    const firstName = teacherObj.name.split(' ').slice(0, -1).join(' ');
    const lastName = teacherObj.name.split(' ').slice(-1).join(' ');

    const teacher = await Teacher.create({
      firstName,
      lastName,
      email: teacherObj.email,
      phone: teacherObj.phone,
      school: teacherObj.school,
    });

    return { teacher };
  } catch (err) {
    console.log(err);
    return {
      error: 'Could not create teacher',
    };
  }
};

/**
 * Get schedule from Calendly by making sequential API calls
 *
 * @description   1. Retrieve location from request profile
 *                2. Perform a GET request on calendly's GET-CURRENT-USER endpoint
 *                3. Perform a GET request on calendly's LIST-EVENTS endpoint
 *                4. Find the event that contains the location param
 *                5. Perform a GET request on calendly's LIST-EVENT-INVITEES endpoint
 *                6. Filter each invitees to keep only the relevant parameters
 *                7. Perform a GET request on calendly's GET-EVENT to add start/end
 *                    time information to invitee object
 */
const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findAll({
      include: [
        {
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
      where: {
        _locationId: req.location._id,
      },
    });

    return res.status(200).json(schedule);
  } catch (err) {
    console.log(err);
    return { err: 'Error getting schedule' };
  }
};

const addAppointment = async (req, res) => {
  try {
    console.log(req.body);
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
      },
    };
    const eventInfo = await fetch(req.body.payload.event, options);
    const event = await eventInfo.json();
    console.log(event);
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

    const nameArr = req.body.payload.name.split(' ');

    const [findTeacher] = await Teacher.findOrCreate({
      where: {
        email: req.body.payload.email,
      },
      defaults: {
        firstName: nameArr[0],
        lastName: nameArr.length > 1 ? nameArr[nameArr.length - 1] : null,
        phone: req.body.payload.questions_and_answers[1].answer, // FIX BASED ON ACTUAL FORM
        _schoolId: findSchool._id,
      },
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

module.exports = {
  addAppointment,
  getSchedule,
};

/* eslint-disable no-underscore-dangle */
const fetch = require('cross-fetch'); // FIXXXX
const { Teacher, Schedule, ScheduleItem, Location } = require('../models');

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

// List of valid locations. TODO: query from location database
const LOCATIONS = ['nashville', 'antioch'];

/**
 * Returns the current organization URI that will be
 * used to query for Calendly events
 */
const getCurrentUser = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
    },
  };
  return fetch('https://api.calendly.com/users/me', options)
    .then((data) => data.json())
    .catch((err) => console.log('error:', err));
};

const listEvents = async (organization) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
    },
  };
  return fetch(
    `https://api.calendly.com/scheduled_events/?organization=${encodeURIComponent(
      organization
    )}`,
    options
  )
    .then((data) => data.json())
    .catch((err) => console.log('error:', err));
};

const findEventWithLocation = (eventCollection, locationToFind) => {
  let eventIndex = -1;
  // loop through eventsCollection to find the index where event name contains location
  eventCollection.forEach((event, index) => {
    if (event.name.toLowerCase().includes(locationToFind)) {
      eventIndex = index;
    }
  });

  if (eventIndex !== -1) return eventCollection[eventIndex];

  // Throw an error if location name is not found in any of the calendly events name
  // eslint-disable-next-line no-throw-literal
  throw {
    error:
      'The requested location name is not found in any of the Calendly events name',
  };
};

const listEventInvitees = async (eventUuid) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
    },
  };
  return fetch(
    `https://api.calendly.com/scheduled_events/${eventUuid}/invitees`,
    options
  )
    .then((data) => data.json())
    .catch((err) => console.log('error:', err));
};

const getEvent = async (uuid) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
    },
  };
  return fetch(`https://api.calendly.com/scheduled_events/${uuid}`, options)
    .then((data) => data.json())
    .catch((err) => console.log('error:', err));
};

/**
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {function} next - Next middleware.
 * @param {string} loc - The location passed to endpoint param
 * @return {Object} -
 */
// eslint-disable-next-line consistent-return
const locationParam = async (req, res, next, loc) => {
  const locationString = loc.toLowerCase();
  if (!LOCATIONS.includes(locationString)) {
    return res
      .status(403)
      .json({ error: 'The requested location is not found in database' });
  }
  req.profile = locationString;
  return next();
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
    // 1. Retrieve location from request profile
    const location = req.profile;
    // 2. Perform a GET request on calendly's GET-CURRENT-USER endpoint
    const jsonResponse = await getCurrentUser()
      .then((userData) => {
        // 3. Perform a GET request on calendly's LIST-EVENTS endpoint
        console.log(userData);
        return listEvents(userData.resource.current_organization);
      })
      .then((eventsList) =>
        // 4. Find the event that contains the location param
        findEventWithLocation(eventsList.collection, location)
      )
      .then((eventData) => {
        // 5. Perform a GET request on calendly's LIST-EVENT-INVITEES endpoint
        const eventUuid = eventData.uri.split('/').pop();
        return listEventInvitees(eventUuid);
      })
      .then((inviteesCollection) => {
        // 6. Filter each invitees to keep only the relevant parameters
        // 6.1 Query teacher from teacher database
        const { collection } = inviteesCollection;

        // add id to the collection of invitees by getting the ID from addTeacher2 return
        const teacherCollection = Promise.all(
          collection.map(async (invitee) => {
            const teacherObj = {
              name: invitee.name,
              email: invitee.email,
              phone: invitee.questions_and_answers[1].answer,
              school: invitee.questions_and_answers[0].answer,
            };

            const teacher = await addTeacher2(teacherObj);
            const teacherWithId = {
              ...teacherObj,
              _teacherId: teacher.teacher._teacherId,
              uri: invitee.uri,
            };
            return teacherWithId;
          })
        );
        return teacherCollection;
      })
      .then((invitees) => {
        // 7. Perform a GET request on calendly's GET-EVENT to add start/end
        //    time information to invitee object
        const schedule = Promise.all(
          invitees.map((invitee) => {
            // Perform the GET request for each user
            const inviteeEventUuid = invitee.uri.split('/')[4]; // get uuid
            return getEvent(inviteeEventUuid).then((data) => {
              // add start and end times to the invitee object
              const newInviteeObject = {
                ...invitee,
                ...{ start_time: data.resource.start_time },
                ...{ end_time: data.resource.end_time },
              };
              return newInviteeObject;
            });
          })
        );
        return schedule;
      })
      .catch((err) => err);
    return res.status(200).json(jsonResponse);
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

    const nameArr = req.body.payload.name.split(' ');

    const [findTeacher] = await Teacher.findOrCreate({
      where: {
        email: req.body.payload.email,
      },
      defaults: {
        firstName: nameArr[0],
        lastName: nameArr.length > 1 ? nameArr[nameArr.length - 1] : null,
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
  locationParam,
};

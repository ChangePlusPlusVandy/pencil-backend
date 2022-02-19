import fetch from 'node-fetch';

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
  console.log('this is org', encodeURIComponent(organization));
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
  const locations = ['nashville', 'antioch'];
  const locationString = loc.toLowerCase();
  if (!locations.includes(locationString)) {
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
 */
const getSchedule = async (req, res) => {
  try {
    // 1. Retrieve location from request profile
    const location = req.profile;
    // 2. Perform a GET request on calendly's GET-CURRENT-USER endpoint
    const jsonResponse = await getCurrentUser()
      .then((userData) =>
        // 3. Perform a GET request on calendly's LIST-EVENTS endpoint
        listEvents(userData.resource.current_organization)
      )
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
        const { collection } = inviteesCollection;
        const newArr = collection.map((item) => {
          console.log('this is one item', item);
          return {
            name: item.name,
            email: item.email,
            uri: item.uri,
            school: item.questions_and_answers[0].answer,
            phone: item.questions_and_answers[1].answer,
          };
        });
        console.log('this is new collection', newArr);
        return newArr;
      })
      .catch((err) => err);
    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.log(err);
    return { err: 'Error getting schedule' };
  }
};

export default {
  getSchedule,
  locationParam,
};

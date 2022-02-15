import fetch from 'node-fetch';

/**
 * Returns the current organization URI that will be
 * used to query for Calendly events
 */
const getOrganizationUri = async (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SCHEDULER_BEARER_AUTH_TOKEN}`,
    },
  };
  fetch('https://api.calendly.com/users/me', options)
    .then((data) => data.json())
    .then((json) => res.status(200).json(json))
    .catch((err) => console.log('error:', err));
};

export default { getOrganizationUri };

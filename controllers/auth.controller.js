// We will put all ES lint disables in the beginning for later cleanup.
/* eslint-disable consistent-return */

const crypto = require('crypto');
const firebase = require('../firebase.js');

/**
 * Middleware function for adding key information on Calendly.
 * Returns a 403 response status if there is an error in signature or signature timestamp.
 * @param {Object} req - Request Object.
 * @param {Object} res - Response Object.
 * @param {function} next - Next middleware.
 * @returns {function} - Call to next controller.
 */
const requireKey = async (req, res, next) => {
  const webhookSigningKey = process.env.WEBHOOK_SIGNING_KEY;

  const calendlySignature = req.get('Calendly-Webhook-Signature');
  const { t, signature } = calendlySignature.split(',').reduce(
    (acc, currentValue) => {
      const [key, value] = currentValue.split('=');

      if (key === 't') {
        acc.t = value;
      }

      if (key === 'v1') {
        acc.signature = value;
      }

      return acc;
    },
    {
      t: '',
      signature: '',
    }
  );

  if (!t || !signature) {
    return res.status(403).send('Invalid signature');
  }

  const data = `${t}.${JSON.stringify(req.body)}`;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSigningKey)
    .update(data, 'utf8')
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(403).send('Invalid Signature');
  }

  const tolerance = 180000;
  const timestampMilliseconds = Number(t) * 1000;

  if (timestampMilliseconds < Date.now() - tolerance) {
    return res.status(403).send('Invalid Signature Time Stamp');
  }
  next();
};

/**
 * Middleware function for adding login token information on firebase authentication.
 * Returns a 403 response status if no login token is provided or an invalid token is provided.
 * @param {Object} req - Request Object.
 * @param {Object} res - Response Object.
 * @param {function} next - Next middleware.
 * @returns {function} - Call to next controller.
 */
const requireLogin = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(403).send('No token provided');
  }

  if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
    return res.status(403).send('Invalid token');
  }

  const token = headerToken.split(' ')[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch((err) => res.status(403).send(err.message));
};

module.exports = {
  requireKey,
  requireLogin,
};

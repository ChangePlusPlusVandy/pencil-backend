const crypto = require('crypto');
const firebase = require('../firebase.js');

// eslint-disable-next-line consistent-return
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
    return res.status(403).json({ error: 'Invalid Signature' });
  }

  const data = `${t}.${JSON.stringify(req.body)}`;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSigningKey)
    .update(data, 'utf8')
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(403).json({ error: 'Invalid Signature' });
  }

  const tolerance = 180000;
  const timestampMilliseconds = Number(t) * 1000;

  if (timestampMilliseconds < Date.now() - tolerance) {
    return res.status(403).json({ error: 'Invalid Signature Time Stamp' });
  }

  next();
};

// eslint-disable-next-line consistent-return
const requireLogin = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.send({ message: 'No token provided' }).status(403);
  }

  if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
    return res.status(403).send({ message: 'Invalid token' });
  }

  const token = headerToken.split(' ')[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch((err) => res.status(403).send({ message: err }));
};

module.exports = {
  requireKey,
  requireLogin,
};

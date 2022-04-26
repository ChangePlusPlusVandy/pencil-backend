const crypto = require('crypto');
const firebaseAdmin = require('firebase-admin');

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
    throw new Error('Invalid Signature');
  }

  const data = `${t}.${JSON.stringify(req.body)}`;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSigningKey)
    .update(data, 'utf8')
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid Signature');
  }

  // Prevent replay attacks.

  const threeMinutes = 180000;
  const tolerance = threeMinutes;
  const timestampMilliseconds = Number(t) * 1000;

  if (timestampMilliseconds < Date.now() - tolerance) {
    throw new Error(
      "Invalid Signature. The signature's timestamp is outside of the tolerance zone."
    );
  }

  next();
};

const verifyAppCheckToken = async (appCheckToken) => {
  if (!appCheckToken) {
    return null;
  }
  try {
    return firebaseAdmin.appCheck().verifyToken(appCheckToken);
  } catch (err) {
    return null;
  }
};

const requireLogin = async (req, res, next) => {
  console.log(req.header('X-Firebase-AppCheck'));
  const appCheckClaims = await verifyAppCheckToken(
    req.header('X-Firebase-AppCheck')
  );
  if (!appCheckClaims) {
    res.status(401);
    return res.status(403).json({ error: 'Unauthorized' });
  }
  return next();
};

module.exports = {
  requireKey,
  requireLogin,
};

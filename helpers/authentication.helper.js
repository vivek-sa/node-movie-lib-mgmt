const JWT = require('jsonwebtoken');
const { commonErrorHandler } = require('./error-handler.helper');

const signAccessToken = (id) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: id,
    };
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    const options = {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        commonErrorHandler(
          null,
          reject,
          'Failed to sign access token',
          500,
          err,
        );
        return;
      }
      resolve(token);
    });
  });
};

const signRefreshToken = (id) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: id,
    };
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    const options = {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        commonErrorHandler(
          null,
          reject,
          'Failed to sign refresh token',
          500,
          err,
        );
        return;
      }
      resolve(token);
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
};

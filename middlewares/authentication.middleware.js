const JWT = require('jsonwebtoken');
const { commonErrorHandler } = require('../helpers/error-handler.helper');

const verifyAccessToken = (req, res, next) => {
  if (!req.cookies) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }

  JWT.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    (err, payload) => {
      if (err) {
        return commonErrorHandler(req, res, 'unauthorized', 401);
      }
      req.user = payload;
      next();
    },
  );
};

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return commonErrorHandler(req, res, 'refresh token not found', 400);
  }

  JWT.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    (err, payload) => {
      if (err) {
        return commonErrorHandler(req, res, 'unauthorized', 401);
      }
      req.user = payload;
      next();
    },
  );
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};

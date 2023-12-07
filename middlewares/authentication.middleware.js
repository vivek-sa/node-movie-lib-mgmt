const { commonErrorHandler } = require('../helpers/error-handler.helper');
const redisHelper = require('../helpers/redis.helper');

const verifyAccessToken = async (req, res, next) => {
  // if  cookies are not present, send error
  if (!req.cookies) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }
  // get the access token from the cookie
  const accessToken = req.cookies.accessToken;

  // if access token not present, send error
  if (!accessToken) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }

  // get the value of the access token key from redis db
  const userId = await redisHelper.getAsync(accessToken);

  // if no value found, the access token is not present in redis, send 401 (unauthorized)
  if (!userId) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }

  // set the user id to request object
  req.user = { id: userId };

  // call next middleware
  next();
};

const verifyRefreshToken = async (req, res, next) => {
  // if  cookies are not present, send error
  if (!req.cookies) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }

  // get the refresh token from the cookie
  const refreshToken = req.cookies.refreshToken;

  // if refresh token not present, send error
  if (!refreshToken) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }

  // get the value of the refresh token key from redis db
  const userId = await redisHelper.getAsync(refreshToken);

  // if no value found, the refresh token is not present in redis, send 401 (unauthorized)
  if (!userId) {
    return commonErrorHandler(req, res, 'unauthorized', 401);
  }

  // set the user id to request object
  req.user = { id: userId };

  // call next middleware
  next();
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};

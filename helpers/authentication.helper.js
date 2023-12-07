const redisHelper = require('../helpers/redis.helper');

// generate random alphanumeric token using random function from math library
const generateRandomToken = () => {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
};

const signAccessToken = async (id) => {
  try {
    // generate the random token and store it in access token variable
    const accessToken = generateRandomToken();

    // insert the key as accessToken and value as user id in the redis db
    await redisHelper.setWithExpiryAsync(
      accessToken,
      id.toString(),
      // set the expiry for the access token in redis
      parseInt(process.env.ACCESS_TOKEN_EXPIRY),
    );

    // return the access token
    return accessToken;
  } catch (err) {
    // error (internal server error)
    err.statusCode = 500;
    throw err;
  }
};

const signRefreshToken = async (id) => {
  try {
    // generate the random token and store it in refresh token variable
    const refreshToken = generateRandomToken();

    // insert the key as refreshToken and value as user id in the redis db
    await redisHelper.setWithExpiryAsync(
      refreshToken,
      id.toString(),
      // set the expiry for the refresh token in redis
      parseInt(process.env.REFRESH_TOKEN_EXPIRY),
    );

    // return the access token
    return refreshToken;
  } catch (err) {
    // error (internal server error)
    err.statusCode = 500;
    throw err;
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
};

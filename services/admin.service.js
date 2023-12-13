const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const redisHelper = require('../helpers/redis.helper');
const {
  signAccessToken,
  signRefreshToken,
} = require('../helpers/authentication.helper');

// login admin service function
const loginAdmin = async (payload) => {
  try {
    // get the email and password from the payload
    const { email, password } = payload;

    // find if the user exists with the email
    const user = await User.findOne({ email: email });

    // if no user exists, send 404 (not found)
    if (!user) {
      const error = new Error('user not registered');
      error.statusCode = 404;
      throw error;
    }

    // check if the credentials matches
    const isMatch = await bcrypt.compare(password, user.password);

    // give 401 (unauthorized), if credentials not match
    if (!isMatch) {
      const error = new Error('email/password is invalid');
      error.statusCode = 401;
      throw error;
    }

    // get the user id from the user object for storing it in the token value
    const { _id: userId } = user;

    // get the access and refresh token by setting user id in the value
    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);

    // return access token and refresh token to the controller
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

// logout admin service function
const logoutAdmin = async (payload) => {
  try {
    // get the access token and refresh token from the payload
    const { accessToken, refreshToken } = payload;

    // delete tokens from redis
    await redisHelper.deleteAsync(accessToken);
    await redisHelper.deleteAsync(refreshToken);

    // return success log out message to the controller
    return 'Logged out successfully';
  } catch (error) {
    throw error;
  }
};

// register admin service function
const registerAdmin = async (payload) => {
  try {
    // get the user details from the payload
    const { firstName, lastName, email, password, role } = payload;

    // check if user already exists with the same email address
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });

    // if user exists, send 409 (conflict)
    if (existingAdmin) {
      const error = new Error('email already registered');
      error.statusCode = 409;
      throw error;
    }

    // hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user payload for admin
    const admin = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
    });

    // save the user in the database
    const savedUser = await admin.save();

    // return the saved user
    return savedUser;
  } catch (error) {
    throw error;
  }
};

// refresh access token service function
const refreshAccessToken = async (payload) => {
  try {
    // get the access token and refresh token from the payload
    const { accessToken, refreshToken } = payload;

    // delete tokens from redis
    if (accessToken) await redisHelper.deleteAsync(accessToken);
    await redisHelper.deleteAsync(refreshToken);

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  refreshAccessToken,
};

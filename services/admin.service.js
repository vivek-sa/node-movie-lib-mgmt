const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const {
  signAccessToken,
  signRefreshToken,
} = require('../helpers/authentication.helper');

const loginAdmin = async (payload) => {
  try {
    const { email, password } = payload;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('user not registered');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('email/password is invalid');
      error.statusCode = 401;
      throw error;
    }
    const { _id: userId } = user;

    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const registerAdmin = async (payload) => {
  try {
    const { firstName, lastName, email, password, role } = payload;

    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      const error = new Error('email already registered');
      error.statusCode = 409;
      throw error;
    }

    // hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
    });

    const savedUser = await admin.save();

    return savedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
};

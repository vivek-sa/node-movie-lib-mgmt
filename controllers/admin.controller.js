const {
  signAccessToken,
  signRefreshToken,
} = require('../helpers/authentication.helper');
const { commonErrorHandler } = require('../helpers/error-handler.helper');
const adminService = require('../services/admin.service');

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await adminService.loginAdmin({
      email,
      password,
    });

    // cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secured: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secured: true,
    });
    res.data = 'Logged In Successfully';
    res.statusCode = 200;
    next();
  } catch (error) {
    console.log('Error: ', error);
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.data = 'Logged out successfully';
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await adminService.registerAdmin({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.data = { user };
    res.statusCode = 201;
    next();
  } catch (error) {
    console.log('Error : ', error);
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const accessToken = await signAccessToken(req.user.id);
    const refreshToken = await signRefreshToken(req.user.id);
    // cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secured: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secured: true,
    });
    res.statusCode = 200;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  refreshToken,
};

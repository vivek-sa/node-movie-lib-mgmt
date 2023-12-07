const {
  signAccessToken,
  signRefreshToken,
} = require('../helpers/authentication.helper');
const { commonErrorHandler } = require('../helpers/error-handler.helper');
const adminService = require('../services/admin.service');

// get the expiry time for cookies from env file
const { ACCESS_TOKEN_COOKIE_EXPIRY_HRS, REFRESH_TOKEN_COOKIE_EXPIRY_HRS } =
  process.env;

// parse the expiry time to integer for both tokens
const accessTokenExpiryHrs = parseInt(ACCESS_TOKEN_COOKIE_EXPIRY_HRS);
const refreshTokenExpiryHrs = parseInt(REFRESH_TOKEN_COOKIE_EXPIRY_HRS);

const loginAdmin = async (req, res, next) => {
  try {
    // get email and password from the request body
    const { email, password } = req.body;
    // get the access token and refresh token on successful login
    const { accessToken, refreshToken } = await adminService.loginAdmin({
      email,
      password,
    });

    // set the cookie for access token (secure and httpOnly - true)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + accessTokenExpiryHrs * 3600000), // hrs in milliseconds
    });
    // set the cookie for refresh token (secure and httpOnly - true)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + refreshTokenExpiryHrs * 3600000), // hrs in milliseconds
    });

    // send message for successful log in
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
    // get the accessToken and refreshToken from the cookies
    const { accessToken, refreshToken } = req.cookies;
    // get the message of logout on successful deletion of tokens from redis db
    const message = await adminService.logoutAdmin({
      accessToken,
      refreshToken,
    });
    // clear access token cookie
    res.clearCookie('accessToken');
    // clear refresh token cookie
    res.clearCookie('refreshToken');
    // set the message in response
    res.data = message;
    next();
  } catch (error) {
    // call error handler if get any error
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    // get the fields of user from request body
    const { firstName, lastName, email, password, role } = req.body;
    // get the user after registering user
    const user = await adminService.registerAdmin({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    // send the user in the response with status code 201 (created)
    res.data = { user };
    res.statusCode = 201;
    next();
  } catch (error) {
    console.log('Error : ', error);
    // call error handler if get any error
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    // delete current access token and refresh token from the cache
    await adminService.refreshAccessToken({
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    });
    // generate new access token and refresh token
    const accessToken = await signAccessToken(req.user.id);
    const refreshToken = await signRefreshToken(req.user.id);

    // set the cookie for access token (secure and httpOnly - true)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + accessTokenExpiryHrs * 3600000), // hrs in milliseconds
    });

    // set the cookie for refresh token (secure and httpOnly - true)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + refreshTokenExpiryHrs * 3600000), // hrs in milliseconds
    });

    // give the successful message for token refresh in response
    res.data = 'Token refreshed successfully';
    res.statusCode = 200;
    next();
  } catch (error) {
    console.log('ERROR : ', error);
    // call error handler if get any error
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  refreshAccessToken,
};

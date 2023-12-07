const { commonErrorHandler } = require('../helpers/error-handler.helper');
const User = require('../models/User.model');

const checkRole = (roles) => async (req, res, next) => {
  // get the id from the req object
  const { id } = req.user;
  // find if user exists with the given role
  const user = await User.findById(id);
  // send forbidden (403) status code if the user does not have the required role
  if (!user || !roles.includes(user.role)) {
    const message =
      'You do not have sufficient permissions to perform this action.';
    commonErrorHandler(req, res, message, 403);
  } else {
    // proceed to the next middleware
    next();
  }
};

module.exports = {
  checkRole,
};

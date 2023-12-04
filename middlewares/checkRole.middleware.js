const { commonErrorHandler } = require('../helpers/error-handler.helper');
const User = require('../models/User.model');

const checkRole = (roles) => async (req, res, next) => {
  // get the id from the req object
  const { id } = req.user;
  // find if user exists with the given role
  const user = await User.findById(id);
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

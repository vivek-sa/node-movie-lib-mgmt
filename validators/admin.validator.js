const Joi = require('joi');
const { validateRequest } = require('../helpers/common-function.helper');

// login admin validator
const loginAdminSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(), // password must be 6 characters long
  });
  validateRequest(req, res, next, schema, 'body');
};

// register admin validator
const registerAdminSchema = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'visitor').required(), // role can be either admin or visitor
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  loginAdminSchema,
  registerAdminSchema,
};

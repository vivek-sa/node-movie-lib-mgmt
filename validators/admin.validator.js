const Joi = require('joi');
const { validateRequest } = require('../helpers/common-function.helper');

const loginAdminSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, res, next, schema, 'body');
};

const registerAdminSchema = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'visitor').required(),
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  loginAdminSchema,
  registerAdminSchema,
};

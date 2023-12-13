const Joi = require('joi');
const { validateRequest } = require('../helpers/common-function.helper');

// get all movies validator
const getMoviesSchema = async (req, res, next) => {
  // joi schema to validate the query parameters (optional)
  const schema = Joi.object({
    limit: Joi.number().integer().min(1), // limit should not be negative or zero
    page: Joi.number().integer().min(1), // page should not be negative or zero
    // genres can be a single string, or a group of strings (comma separated) (hyphens allowed in genres)
    genres: Joi.string().pattern(/^[a-zA-Z]+(?:[-,][a-zA-Z]+)*$/),
  });
  validateRequest(req, res, next, schema, 'query');
};

// create movie validator
const createMovieSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    plot: Joi.string().required(),
    genres: Joi.array().items(Joi.string().required()).min(1).required(),
    runtime: Joi.string().pattern(/^\d+$/).required(), // should be one or more digits
    cast: Joi.array().items(Joi.string().required()).min(1).required(),
    languages: Joi.array().items(Joi.string().required()).min(1).required(),
    released: Joi.date().iso().required(),
    directors: Joi.array().items(Joi.string().required()).min(1).required(),
    year: Joi.string()
      .pattern(/^\d{4}$/) // 4 digits only
      .required(),
    imdbRating: Joi.string()
      .pattern(/^\d+(\.\d{1,2})?$/) // numeric with optional decimal up to two places
      .required(),
  });
  validateRequest(req, res, next, schema, 'body');
};

// update movie validator
const updateMovieSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    plot: Joi.string(),
    genres: Joi.array().items(Joi.string()),
    runtime: Joi.string().pattern(/^\d+$/), // should be one or more digits
    cast: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    released: Joi.date().iso(),
    directors: Joi.array().items(Joi.string()),
    year: Joi.string().pattern(/^\d{4}$/), // 4 digits only
    imdbRating: Joi.string().pattern(/^\d+(\.\d{1,2})?$/), // numeric with optional decimal up to two places
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  getMoviesSchema,
  createMovieSchema,
  updateMovieSchema,
};

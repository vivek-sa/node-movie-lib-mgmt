const { commonErrorHandler } = require('../helpers/error-handler.helper');
const genreService = require('../services/genre.service');

// get all genres controller
const getGenres = async (req, res, next) => {
  try {
    // get the limit, page, and genre (for filter) from request query parameters
    const { limit, page } = req.query;

    // get all the genres
    const genres = await genreService.getGenres({ limit, page });

    // no genres found
    if (genres.length === 0) {
      res.data = 'no genres found';
    }

    // send genres in response
    else res.data = { genres };

    next();
  } catch (error) {
    // call error handler if get any error
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

module.exports = {
  getGenres,
};

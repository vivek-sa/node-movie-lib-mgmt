const { commonErrorHandler } = require('../helpers/error-handler.helper');
const movieService = require('../services/movie.service');

const getMovies = async (req, res, next) => {
  try {
    // get all the movies
    const movies = await movieService.getMovies();

    // no movies found
    if (movies.length === 0) {
      res.data = 'no movies found';
    }
    // send movies in response
    else res.data = { movies };

    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const getMovie = async (req, res, next) => {
  try {
    // get the movie id from request parameter
    const { id: movieId } = req.params;

    // get the specific movie
    const movie = await movieService.getMovie({ movieId });

    // send movie in response
    res.data = { movie };
    next();
  } catch (error) {
    console.log('Error: ', error);
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const uploadMovie = async (req, res, next) => {
  try {
    // user id of logged in user
    const { id: userId } = req.user;

    // getting file buffer and file name from request object
    const { buffer: fileBuffer, originalname: fileName } = req.file;

    // getting movie details from request object
    const {
      title,
      plot,
      genres,
      runtime,
      cast,
      languages,
      released,
      directors,
      year,
      imdbRating,
    } = req.body;

    // upload the movie and get the movie details
    const movie = await movieService.uploadMovie({
      userId,
      title,
      plot,
      genres,
      runtime,
      cast,
      languages,
      released,
      directors,
      year,
      imdbRating,
      fileBuffer,
      fileName,
    });

    // send saved movie details in response with status code 201 (created)
    res.data = { movie };

    res.statusCode = 201;
    next();
  } catch (error) {
    console.log('Error: ', error);
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    // movie id from request parameter
    const { id: movieId } = req.params;

    // fields that needs to be updated
    const { ...updateFields } = req.body;

    // get the updated movie
    const movie = await movieService.updateMovie({ movieId, updateFields });

    // send movie in the response
    res.data = { movie };
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    // movie id from request parameter
    const { id: movieId } = req.params;

    // get the message after movie deletion
    const message = await movieService.deleteMovie({ movieId });

    // send the message in the response
    res.data = message;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode || 400, error);
  }
};

module.exports = {
  getMovies,
  getMovie,
  uploadMovie,
  updateMovie,
  deleteMovie,
};

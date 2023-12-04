const {
  processMovieAndGetS3Links,
  deleteMovieFromS3,
} = require('../helpers/movie.helper');
const Movie = require('../models/movie.model');

const getMovies = async () => {
  try {
    // get all movies
    const movies = await Movie.find();
    return movies;
  } catch (error) {
    throw error;
  }
};

const getMovie = async (payload) => {
  try {
    const { movieId } = payload;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      const error = new Error('Movie not found');
      error.statusCode = 404;
      throw error;
    }
    return movie;
  } catch (error) {
    throw error;
  }
};

const uploadMovie = async (payload) => {
  try {
    // destructure variables from payload object
    const {
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
    } = payload;

    // check if the title already exists
    const existingMovie = await Movie.findOne({ title: title });

    if (existingMovie) {
      const error = new Error('movie with the given title already exists');
      error.statusCode = 409;
      throw error;
    }

    // generate links of 720p resolution, 1080p resolution and thumbnail for movie
    const { link720p, link1080p, linkThumbnail } =
      await processMovieAndGetS3Links(fileBuffer, fileName, title);

    // create the movie payload
    const movie = new Movie({
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
      uploadedBy: userId,
      s3Link720p: link720p,
      s3Link1080p: link1080p,
      s3LinkThumbnail: linkThumbnail,
    });

    // save movie in the database
    const savedMovie = await movie.save();

    return savedMovie;
  } catch (error) {
    throw error;
  }
};

const updateMovie = async (payload) => {
  try {
    // get the movie id and fields for updating movie
    const { movieId, updateFields } = payload;

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { $set: updateFields },
      { new: true },
    );

    if (!updatedMovie) {
      const error = new Error('Movie not found');
      error.statusCode = 404;
      throw error;
    }
    // movie found and updated
    return updatedMovie;
  } catch (error) {
    throw error;
  }
};

const deleteMovie = async (payload) => {
  try {
    const { movieId } = payload;
    // check if the movie with the given id exists
    const movie = await Movie.findById(movieId);

    if (!movie) {
      const error = new Error('Movie not found');
      error.statusCode = 404;
      throw error;
    }

    // delete the movie folder from s3 bucket
    await deleteMovieFromS3(movie.s3LinkThumbnail);

    // delete the movie from database
    await Movie.findByIdAndDelete(movieId);

    // return message
    return 'movie deleted successfully';
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMovies,
  getMovie,
  uploadMovie,
  updateMovie,
  deleteMovie,
};
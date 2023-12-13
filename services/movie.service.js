const Movie = require('../models/Movie.model');
const Genre = require('../models/Genre.model');

const { suggestMovieProducer } = require('../helpers/kafka.helper');

const {
  processMovieAndGetS3Links,
  deleteMovieFromS3,
} = require('../helpers/movie.helper');
// const { getGenreNamesFromIds } = require('./genre.service');
const { getUserIdsForPreferredGenres } = require('./userPreference.service');

// generate array from comma separated value (for filtering)
const parseCSV = (value) =>
  // if value is available, convert all to array along with trimming spaces and converting to lower case
  value ? value.split(',').map((item) => item.trim().toLowerCase()) : null;

const getMovies = async (payload) => {
  try {
    // get the query parameters from payload
    // limit - default value 100
    // page - default value 1
    let { limit = 100, page = 1, genres } = payload;

    // parse genres comma separated values to array of genres
    genres = parseCSV(genres);

    // If genres are provided, find ObjectId for each genre
    const genreIds = genres
      ? await Genre.find({ name: { $in: genres } }, '_id')
      : [];

    // Extract ObjectId values from the result
    const genreObjectIdArray = genreIds.map((genre) => genre._id);

    // If genres are provided, include them in the query
    const query = genres ? { genres: { $in: genreObjectIdArray } } : {};

    // get all movies based on the query
    const movies = await Movie.find(query)
      // .populate('genres', 'name')
      .skip((page - 1) * limit) // provide offset based on the limit and page
      .limit(limit); // shows only the (limit) number of items

    return movies;
  } catch (error) {
    throw error;
  }
};

const getMovie = async (payload) => {
  try {
    // get the movie id from the payload
    const { movieId } = payload;
    // get the movie with ID from database
    const movie = await Movie.findById(movieId);
    // give 404 (not found) if movie having ID is not found
    if (!movie) {
      const error = new Error('Movie not found');
      error.statusCode = 404;
      throw error;
    }
    // return the found movie
    return movie;
  } catch (error) {
    throw error;
  }
};

const uploadMovie = async (payload) => {
  try {
    // destructure variables from payload object
    let {
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

    // replace spaces with underscore for movie title and file name
    title = title.replaceAll(' ', '_');
    fileName = fileName.replaceAll(' ', '_');

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

    // // get genre names from genre ids of the movie
    // const genreNames = await getGenreNamesFromIds({ genres });

    // get user ids of the users having genre of the movie as their genre preference
    const userIds = await getUserIdsForPreferredGenres({ genres });

    // if user preference exists for the genre,
    // send user ids and movie id to the kafka suggest movie consumer
    if (userIds.length > 0) await suggestMovieProducer(userIds, savedMovie._id);

    // return the saved movie to the controller
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

// get movies serializer function
const getMovies = async (req, res, next) => {
  // get the list of movies from response data
  let { movies } = res.data;
  // if no movies found, go to next middleware
  if (!movies) return next();
  // empty response object for storing all movies after serialization
  let response = [];

  // loop through all movies and push each object to the response object
  for (const movie of movies) {
    response.push({
      id: movie.id,
      title: movie.title,
      plot: movie.plot,
      genres: movie.genres,
      runtime: movie.runtime,
      cast: movie.cast,
      languages: movie.languages,
      released: movie.released,
      directors: movie.directors,
      year: movie.year,
      imdbRating: movie.imdbRating,
      uploadedBy: movie.uploadedBy,
      s3Link720p: movie.s3Link720p,
      s3Link1080p: movie.s3Link1080p,
      s3LinkThumbnail: movie.s3LinkThumbnail,
    });
  }
  // set the serialized data to the response object
  res.data.movies = response;

  next();
};

// get movie serializer function
const getMovie = async (req, res, next) => {
  // get the data from response data object
  const { movie } = res.data || null;
  const response = {
    id: movie.id,
    title: movie.title,
    plot: movie.plot,
    genres: movie.genres,
    runtime: movie.runtime,
    cast: movie.cast,
    languages: movie.languages,
    released: movie.released,
    directors: movie.directors,
    year: movie.year,
    imdbRating: movie.imdbRating,
    uploadedBy: movie.uploadedBy,
    s3Link720p: movie.s3Link720p,
    s3Link1080p: movie.s3Link1080p,
    s3LinkThumbnail: movie.s3LinkThumbnail,
  };
  // set the serialized data to the response object
  res.data.movie = response;
  next();
};

// serializer function for upload movie and update movie
const uploadUpdateMovie = async (req, res, next) => {
  // get the data from response data object
  const { movie } = res.data || null;
  const response = {
    id: movie.id,
    title: movie.title,
    plot: movie.plot,
    genres: movie.genres,
    runtime: movie.runtime,
    cast: movie.cast,
    languages: movie.languages,
    released: movie.released,
    directors: movie.directors,
    year: movie.year,
    imdbRating: movie.imdbRating,
    uploadedBy: movie.uploadedBy,
    s3Link720p: movie.s3Link720p,
    s3Link1080p: movie.s3Link1080p,
    s3LinkThumbnail: movie.s3LinkThumbnail,
  };
  // set the serialized data to the response object
  res.data.movie = response;
  next();
};

module.exports = {
  getMovie,
  getMovies,
  uploadUpdateMovie,
};

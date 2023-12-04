const getMovies = async (req, res, next) => {
  let { movies } = res.data;
  if (!movies) return next();
  let response = [];

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

  res.data.movies = response;

  next();
};

const getMovie = async (req, res, next) => {
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
  res.data.movie = response;
  next();
};

const uploadUpdateMovie = async (req, res, next) => {
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
  res.data.movie = response;
  next();
};

module.exports = {
  getMovie,
  getMovies,
  uploadUpdateMovie,
};

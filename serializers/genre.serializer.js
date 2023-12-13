// get genres serializer function
const getGenres = async (req, res, next) => {
  // get the list of genres from response data
  let { genres } = res.data;
  // if no genres found, go to next middleware
  if (!genres) return next();
  // empty response object for storing all genres after serialization
  let response = [];

  // loop through all genres and push each object to the response object
  for (const genre of genres) {
    response.push({
      id: genre.id,
      name: genre.name,
      description: genre.description,
    });
  }

  // set the serialized data to the response object
  res.data.genres = response;

  next();
};

module.exports = {
  getGenres,
};

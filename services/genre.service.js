const Genre = require('../models/Genre.model');

const getGenres = async (payload) => {
  try {
    // get the query parameters from payload
    // limit - default value 100
    // page - default value 1
    let { limit = 100, page = 1 } = payload;

    // get all genres
    const genres = await Genre.find()
      .skip((page - 1) * limit) // provide offset based on the limit and page
      .limit(limit); // shows only the (limit) number of items

    return genres;
  } catch (error) {
    throw error;
  }
};

const getGenreNamesFromIds = async (payload) => {
  try {
    // get the array of genreIds from the payload
    const { genres: genreIds } = payload;

    // get the genre names corresponding to the genre ids
    const genreNames = await Genre.find({
      _id: { $in: genreIds },
    })
      .lean()
      .distinct('name');

    // return the genre names
    return genreNames;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getGenres,
  getGenreNamesFromIds,
};

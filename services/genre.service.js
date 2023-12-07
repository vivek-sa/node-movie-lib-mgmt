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

module.exports = {
  getGenres,
};

const UserPreference = require('../models/UserPreference.model');

const getUserIdsForPreferredGenres = async (payload) => {
  // get the array of genre names from the payload
  const { genreNames } = payload;

  // get the array of user ids from user preference collection for the provided genres
  const userIds = await UserPreference.find({
    genre: { $in: genreNames },
  })
    .lean()
    .distinct('userId');

  // return the user ids
  return userIds;
};

module.exports = {
  getUserIdsForPreferredGenres,
};

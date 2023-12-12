const UserPreference = require('../models/UserPreference.model');

const addUserPreference = async (payload) => {
  try {
    const { userId, genre } = payload;

    // creating the user preference for given userId
    const userPreference = new UserPreference({
      userId: userId,
      genre: genre,
    });

    // storing the user preference in the mongo db collection
    await userPreference.save();
  } catch (error) {
    throw error;
  }
};

const getUserIdsForPreferredGenres = async (payload) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addUserPreference,
  getUserIdsForPreferredGenres,
};

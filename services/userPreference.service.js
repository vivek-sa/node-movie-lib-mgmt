const UserPreference = require('../models/UserPreference.model');

const addUserPreference = async (payload) => {
  try {
    const { userId, genreId } = payload;

    // creating the user preference for given userId
    const userPreference = new UserPreference({
      userId: userId,
      genreId: genreId,
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
    const { genres } = payload;

    // get the array of user ids from user preference collection for the provided genres
    const userIds = await UserPreference.find({
      genreId: { $in: genres },
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

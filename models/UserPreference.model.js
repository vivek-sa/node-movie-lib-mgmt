const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = UserPreference;

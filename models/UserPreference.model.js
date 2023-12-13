const mongoose = require('mongoose');
const { Types } = mongoose;
const Genre = require('../models/Genre.model');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  genreId: {
    type: Types.ObjectId,
    ref: Genre,
    required: true,
  },
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = UserPreference;

const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  plot: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: Types.ObjectId,
      ref: 'Genre',
      required: true,
    },
  ],
  runtime: {
    type: Number,
    required: true,
  },
  cast: {
    type: [String],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  released: {
    type: Date,
    required: true,
  },
  directors: {
    type: [String],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  imdbRating: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  s3Link720p: {
    type: String,
    required: true,
  },
  s3Link1080p: {
    type: String,
    required: true,
  },
  s3LinkThumbnail: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

const mongoose = require('mongoose');
const Genre = require('../models/Genre.model');
const { connectToMongoDb } = require('../dbConnection');

const genresData = [
  {
    name: 'Action',
    description: 'Movies with thrilling action sequences.',
  },
  {
    name: 'Drama',
    description: 'Movies that focus on realistic storytelling.',
  },
  {
    name: 'Comedy',
    description: 'Movies intended to make the audience laugh.',
  },
];

const addGenres = async () => {
  try {
    await connectToMongoDb();
    // Insert genres into the database
    const insertedGenres = await Genre.insertMany(genresData);
    console.log('Genres added successfully:', insertedGenres);
  } catch (error) {
    console.error('Error adding genres:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
};

addGenres();

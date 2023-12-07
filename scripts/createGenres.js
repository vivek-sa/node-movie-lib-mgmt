const mongoose = require('mongoose');
const Genre = require('../models/Genre.model');
const { connectToMongoDb } = require('../dbConnection');

// genres data
const genresData = [
  {
    name: 'action',
    description: 'Movies with thrilling action sequences.',
  },
  {
    name: 'drama',
    description: 'Movies that focus on realistic storytelling.',
  },
  {
    name: 'comedy',
    description: 'Movies intended to make the audience laugh.',
  },
];

const addGenres = async () => {
  try {
    // connect to the database
    await connectToMongoDb();
    // Insert genres into the database
    const insertedGenres = await Genre.insertMany(genresData);
    console.log('Genres added successfully');
  } catch (error) {
    console.error('Error adding genres:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
};

addGenres();

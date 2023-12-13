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
  {
    name: 'sci-fi',
    description:
      'Movies set in futuristic or speculative worlds with advanced technology.',
  },
  {
    name: 'horror',
    description: 'Movies designed to evoke fear and suspense in the audience.',
  },
  {
    name: 'romance',
    description:
      'Movies centered around romantic relationships and love stories.',
  },
  {
    name: 'documentary',
    description:
      'Films that provide a factual and informative account of real events.',
  },
  {
    name: 'fantasy',
    description:
      'Movies featuring magical or fantastical elements often set in imaginary worlds.',
  },
  {
    name: 'thriller',
    description: 'Movies characterized by intense suspense and excitement.',
  },
  {
    name: 'animation',
    description:
      'Movies created through animation techniques, often targeting both children and adults.',
  },
  {
    name: 'mystery',
    description:
      'Movies that involve solving a mysterious event or uncovering hidden truths.',
  },
];

// add genres script for initial data seeding
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

const mongoose = require('mongoose');
require('dotenv').config();

// destructuring the database variables from env file
const {
  DB_BASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_AUTH_SOURCE,
  DB_DATABASE,
} = process.env;

const connectToMongoDb = async () => {
  try {
    // creating the connection url
    const connectionUri = `${DB_BASE_URL}${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
    return mongoose.connect(connectionUri, {
      user: DB_USERNAME,
      pass: DB_PASSWORD,
      authSource: DB_AUTH_SOURCE,
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  connectToMongoDb,
};

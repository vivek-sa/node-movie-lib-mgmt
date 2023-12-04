const mongoose = require('mongoose');
require('dotenv').config();

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
  const connectionUri = `${DB_BASE_URL}${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
  return mongoose.connect(connectionUri, {
    user: DB_USERNAME,
    pass: DB_PASSWORD,
    authSource: DB_AUTH_SOURCE,
  });
};

module.exports = {
  connectToMongoDb,
};

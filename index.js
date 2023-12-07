require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer();
const routes = require('./routes');
const { connectToMongoDb } = require('./dbConnection');
const redisHelper = require('./helpers/redis.helper');

// getting the port from env file
const serverPort = process.env.SERVER_PORT || 5000;

// creating the app instance of express
const app = express();

// for json parsing
app.use(express.json());

// for url encoded parsing
app.use(express.urlencoded({ extended: true }));

// for cookie parsing
app.use(cookieParser());

// registering all the routes in routes folder to the express app
routes.registerRoutes(app);

const startServer = async function () {
  try {
    // connecting to the mongo db database
    await connectToMongoDb();
    console.log('--- Mongo DB connected ---');
    // connecting to the redis client
    await redisHelper.connectClient();
    console.log('--- Redis connected ---');
    // listening the server on specified port
    app.listen(serverPort);
    console.log(`--- Server started on ${serverPort} ---`);
  } catch (err) {
    console.log('server setup failed', err);
    console.log('Error: ', err.message);
  }
};

// executing the above function
startServer();

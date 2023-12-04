require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const { connectToMongoDb } = require('./dbConnection');
const cookieParser = require('cookie-parser');
const serverPort = process.env.SERVER_PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

routes.registerRoutes(app);

const startServer = async function () {
  try {
    await connectToMongoDb();
    console.log(`--- Mongo DB connected ---`);
    app.listen(serverPort);
    console.log(`--- Server started on ${serverPort} ---`);
  } catch (err) {
    console.log('server setup failed', err);
    console.log('Error: ', err.message);
  }
};

startServer();

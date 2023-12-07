const { createClient } = require('redis');

// getting the redis host and port from the env file
// const { REDIS_HOST, REDIS_PORT } = process.env;
const { REDIS_URL } = process.env;

// creating the redis client
// const client = createClient(REDIS_HOST, REDIS_PORT);
const client = createClient({
  url: REDIS_URL,
});

// function for connecting the redis client
const connectClient = async () => {
  await client.connect();
};

// get function for getting the value of the key
const getAsync = async (key) => {
  return client.get(key);
};

// set function for setting the value
const setAsync = async (key, value) => {
  return client.set(key, value);
};

// set with expiry function for setting the expiry along with setting the key
const setWithExpiryAsync = async (key, value, time) => {
  await client.set(key, value);
  return client.expire(key, time);
};

// delete the key from redis
const deleteAsync = async (key) => {
  return client.del(key);
};

module.exports = {
  connectClient,
  getAsync,
  setAsync,
  setWithExpiryAsync,
  deleteAsync,
};

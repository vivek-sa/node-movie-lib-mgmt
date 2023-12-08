const { Kafka } = require('kafkajs');

const UserPreference = require('../models/UserPreference.model');
const { connectToMongoDb } = require('../dbConnection');

// creating the kafka client
const kafka = new Kafka({
  clientId: 'myflix-demo',
  brokers: ['0.0.0.0:9092'],
});

const adminSetup = async () => {
  // creating the kafka admin
  const admin = kafka.admin();
  // connecting the kafka client
  await admin.connect();

  // creating topics
  await admin.createTopics({
    topics: [
      {
        topic: 'user-preference',
        numPartitions: 1,
      },
      {
        topic: 'suggest-movie',
        numPartitions: 1,
      },
    ],
  });
  await admin.disconnect();
};

const userPreferenceConsumer = async () => {
  await connectToMongoDb();
  const consumer = kafka.consumer({ groupId: 'user-1' });
  await consumer.connect();

  await consumer.subscribe({
    topics: ['user-preference'],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      // message => user id and genre
      // store the user id and genre in a table
      const data = JSON.parse(message.value.toString());
      const userId = data.id;
      const genre = data.genre;

      const userPreference = new UserPreference({
        userId: userId,
        genre: genre,
      });

      await userPreference.save();
      console.log('user preference saved');
    },
  });
};

const suggestMovieProducer = async (userIds, movieId) => {
  const producer = kafka.producer();
  console.log('connecting producer...');
  await producer.connect();
  console.log('producer connected successfully...');

  await producer.send({
    topic: 'suggest-movie',
    messages: [
      {
        partition: 0,
        key: 'movie-suggestion',
        value: JSON.stringify({
          userIds: userIds,
          movieId: movieId,
        }),
      },
    ],
  });
  await producer.disconnect();
  console.log('producer disconnected');
};

module.exports = {
  adminSetup,
  userPreferenceConsumer,
  suggestMovieProducer,
};

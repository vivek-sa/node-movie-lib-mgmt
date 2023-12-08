// Importing required modules
const { Kafka } = require('kafkajs');

const UserPreference = require('../models/UserPreference.model');

// Creating the Kafka client
const kafka = new Kafka({
  clientId: 'myflix-demo',
  brokers: ['0.0.0.0:9092'],
});

// Function to set up Kafka admin
const adminSetup = async () => {
  // creating the kafka admin
  const admin = kafka.admin();
  // connecting to kafka admin
  await admin.connect();

  // Creating topics for user preferences and movie suggestions
  await admin.createTopics({
    topics: [
      { topic: 'user-preference', numPartitions: 1 },
      { topic: 'suggest-movie', numPartitions: 1 },
    ],
  });

  await admin.disconnect();
};

// Function for consuming user preferences from Kafka
const userPreferenceConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'user-1' });
  await consumer.connect();

  // Subscribing to the 'user-preference' topic
  await consumer.subscribe({
    topics: ['user-preference'],
    fromBeginning: true,
  });

  // Processing each message and storing user preferences in the database
  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      const userId = data.id;
      const genre = data.genre;

      const userPreference = new UserPreference({
        userId: userId,
        genre: genre,
      });

      await userPreference.save();
      console.log('User preference saved');
    },
  });
};

// Function for producing movie suggestions to Kafka
const suggestMovieProducer = async (userIds, movieId) => {
  const producer = kafka.producer();
  console.log('Connecting producer...');
  await producer.connect();
  console.log('Producer connected successfully...');

  // Sending movie suggestion message to the 'suggest-movie' topic
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
  console.log('Producer disconnected');
};

// Exporting functions for external use
module.exports = {
  adminSetup,
  userPreferenceConsumer,
  suggestMovieProducer,
};

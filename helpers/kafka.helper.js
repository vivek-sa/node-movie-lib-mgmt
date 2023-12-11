// Importing required modules
const { Kafka, logLevel } = require('kafkajs');

const UserPreference = require('../models/UserPreference.model');

// getting the variables for kafka from env file
const {
  KAFKA_CLIENT_ID: kafkaClientId,
  KAFKA_BROKER_HOST: kafkaBrokerHost,
  KAFKA_BROKER_PORT: kafkaBrokerPort,
  KAFKA_TOPIC_USER_PREFERENCE: kafkaTopicUserPreference,
  KAFKA_TOPIC_SUGGEST_MOVIE: kafkaTopicSuggestMovie,
  KAFKA_CONSUMER_GROUP_ID: kafkaConsumerGroupId,
} = process.env;

// Creating the Kafka client
const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: [`${kafkaBrokerHost}:${kafkaBrokerPort}`],
  logLevel: logLevel.NOTHING, // set logging to nothing
});

// Function to set up Kafka admin
const adminSetup = async () => {
  // creating the kafka admin
  const admin = kafka.admin();

  // connecting to kafka admin
  await admin.connect();

  // list existing topics
  const existingTopics = await admin.listTopics();

  // creating topics only if they don't exist
  const topicsToCreate = [
    { topic: kafkaTopicUserPreference, numPartitions: 1 },
    { topic: kafkaTopicSuggestMovie, numPartitions: 1 },
  ];

  // loop through the topics list
  for (const topic of topicsToCreate) {
    // check if the topic is present in the existing topics list
    if (!existingTopics.includes(topic.topic)) {
      // create the topic if it doesn't exist
      await admin.createTopics({
        topics: [topic],
      });
    }
  }

  // disconnect admin
  await admin.disconnect();
};

// Function for consuming user preferences from Kafka
const userPreferenceConsumer = async () => {
  // creating the kafka consumer
  const consumer = kafka.consumer({ groupId: kafkaConsumerGroupId });

  // connecting kafka consumer
  await consumer.connect();

  // Subscribing to the 'user-preference' topic
  await consumer.subscribe({
    topics: [kafkaTopicUserPreference],
    fromBeginning: true,
  });

  // Processing each message and storing user preferences in the database
  await consumer.run({
    eachMessage: async ({ message }) => {
      // getting the value from the message
      const data = JSON.parse(message.value.toString());

      // extracting userId and genre from the data
      const userId = data.userId;
      const genre = data.genre;

      // creating the user preference for given userId
      const userPreference = new UserPreference({
        userId: userId,
        genre: genre,
      });

      // storing the user preference in the mongo db collection
      await userPreference.save();

      console.log('User preference saved');
    },
  });
};

// Function for producing movie suggestions to Kafka
const suggestMovieProducer = async (userIds, movieId) => {
  // creating the kafka producer
  const producer = kafka.producer();

  console.log('Connecting producer...');

  // connecting the kafka producer
  await producer.connect();

  console.log('Producer connected successfully...');

  // sending movie suggestion message to the 'suggest-movie' topic
  await producer.send({
    topic: kafkaTopicSuggestMovie,
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

  // disconnecting the kafka producer
  await producer.disconnect();
  console.log('Producer disconnected');
};

// Exporting functions for external use
module.exports = {
  adminSetup,
  userPreferenceConsumer,
  suggestMovieProducer,
};

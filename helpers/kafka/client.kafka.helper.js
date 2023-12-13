// Importing required modules
const { Kafka, logLevel } = require('kafkajs');

// getting the variables for kafka from env file
const {
  KAFKA_CLIENT_ID: kafkaClientId,
  KAFKA_BROKER_HOST: kafkaBrokerHost,
  KAFKA_BROKER_PORT: kafkaBrokerPort,
  KAFKA_TOPIC_USER_PREFERENCE: kafkaTopicUserPreference,
  KAFKA_TOPIC_SUGGEST_MOVIE: kafkaTopicSuggestMovie,
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

module.exports = {
  kafka,
  adminSetup,
};

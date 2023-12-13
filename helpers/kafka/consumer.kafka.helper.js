const { addUserPreference } = require('../../services/userPreference.service');

// getting the variables for kafka from env file
const {
  KAFKA_TOPIC_USER_PREFERENCE: kafkaTopicUserPreference,
  KAFKA_CONSUMER_GROUP_ID: kafkaConsumerGroupId,
} = process.env;

// get the kafka client
const { kafka } = require('./client.kafka.helper');

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
      const genreId = data.genreId;

      // save the user preference to the database
      await addUserPreference({ userId, genreId });

      console.log('User preference saved');
    },
  });
};

module.exports = {
  userPreferenceConsumer,
};

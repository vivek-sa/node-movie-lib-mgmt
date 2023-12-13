// get the kafka client
const { kafka } = require('./client.kafka.helper');

// getting the variables for kafka from env file
const { KAFKA_TOPIC_SUGGEST_MOVIE: kafkaTopicSuggestMovie } = process.env;

// creating the global producer
const producer = kafka.producer();

// Function for connecting to the producer
const connectProducer = async () => {
  await producer.connect();
};

// Function for producing movie suggestions to Kafka
const suggestMovieProducer = async (userId, movieId) => {
  // sending movie suggestion message to the 'suggest-movie' topic
  await producer.send({
    topic: kafkaTopicSuggestMovie,
    messages: [
      {
        partition: 0,
        key: 'movie-suggestion',
        // send the list of user ids along with the movie id to the consumer
        value: JSON.stringify({
          userId: userId,
          movieId: movieId,
        }),
      },
    ],
  });
};

module.exports = {
  connectProducer,
  suggestMovieProducer,
};

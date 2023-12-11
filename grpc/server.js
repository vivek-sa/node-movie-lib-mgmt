const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { getMovies, getMovie } = require('../services/movie.service');
const { getGenres } = require('../services/genre.service');
const { createProtoFile } = require('./protoFileGenerator');

// proto files path
const MOVIES_PROTO_PATH = __dirname + '/movies.proto';
const GENRES_PROTO_PATH = __dirname + '/genres.proto';

// github movies proto file url
const moviesProtoUrl = process.env.MOVIES_PROTO_URL;
// github genres proto file url
const genresProtoUrl = process.env.GENRES_PROTO_URL;

const { GRPC_PORT: grpcPort, GRPC_HOST: grpcHost } = process.env;

// options for proto buffer
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// main function for running the grpc server
const runGrpcServer = async () => {
  try {
    // creating the proto files for movies and genres
    await createProtoFile(moviesProtoUrl, 'movies');
    await createProtoFile(genresProtoUrl, 'genres');

    // creating the proto package definition from the proto files
    const movieProtoPackageDefinition = protoLoader.loadSync(
      MOVIES_PROTO_PATH,
      options,
    );
    const genreProtoPackageDefinition = protoLoader.loadSync(
      GENRES_PROTO_PATH,
      options,
    );

    // loading the proto buff
    const moviesProto = grpc.loadPackageDefinition(movieProtoPackageDefinition);
    const genresProto = grpc.loadPackageDefinition(genreProtoPackageDefinition);

    // creating a new grpc server
    const server = new grpc.Server();

    // adding the movie service to the server
    server.addService(moviesProto.MovieService.service, {
      // get all movies service function
      getAllMovies: async (_, callback) => {
        try {
          // get all movies from the server using movie service function call
          const movies = await getMovies({});
          const response = {
            movies: movies,
          };
          // send the response containing all the movies
          callback(null, response);
        } catch (error) {
          // if any error occurred, send it in the callback
          console.error('Error in getAllMovies:', error);
          callback({
            code: grpc.status.INTERNAL, // code = 13 for internal server error
            details: 'Internal Server Error',
          });
        }
      },

      // get movie by id service function
      getMovieById: async (call, callback) => {
        // the id is in call.request object (coming from the function call from client)
        try {
          // get the movie by id
          const movie = await getMovie({
            movieId: call.request.id,
          });

          // if no error, send the movie to the client
          callback(null, movie);
        } catch (error) {
          console.error('Error in getMovieById:', error);

          // if the error code while getting the movie is 404, movie does not exists
          if (error.statusCode === 404) {
            callback({
              code: grpc.status.NOT_FOUND, // code = 5 for not found
              details: 'Movie Not Found',
            });
          }

          // else send internal server error
          callback({
            code: grpc.status.INTERNAL, // code = 13 for internal server error
            details: 'Internal Server Error',
          });
        }
      },
    });

    // adding the genre service to the server
    server.addService(genresProto.GenreService.service, {
      // get all genres service function
      getAllGenres: async (_, callback) => {
        try {
          // get all the genres
          const genres = await getGenres({});

          // send genres in the response
          const response = {
            genres: genres,
          };
          callback(null, response);
        } catch (error) {
          // if any error occurs, send it in the response
          console.error('Error in getAllGenres:', error);
          callback({
            code: grpc.status.INTERNAL, // code = 13 for internal server error
            details: 'Internal Server Error',
          });
        }
      },
    });

    // binding the server and specifying the url and port
    server.bindAsync(
      `${grpcHost}:${grpcPort}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        // if any error occurs while starting the gRPC server, throw it
        if (error) throw error;
        server.start();
      },
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  runGrpcServer,
};

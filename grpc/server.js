const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { connectToMongoDb } = require('../dbConnection');
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

const grpcPort = process.env.GRPC_PORT;

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

  // connecting to mongo db for service calls
  await connectToMongoDb();

  // adding the movie service to the server
  server.addService(moviesProto.MovieService.service, {
    getAllMovies: async (_, callback) => {
      try {
        const movies = await getMovies({});
        const response = {
          movies: movies,
        };
        callback(null, response);
      } catch (error) {
        console.error('Error in getAllMovies:', error);
        callback({
          code: grpc.status.INTERNAL,
          details: 'Internal Server Error',
        });
      }
    },
    getMovieById: async (call, callback) => {
      try {
        const movie = await getMovie({
          movieId: call.request.id,
        });
        const response = movie;
        callback(null, response);
      } catch (error) {
        console.error('Error in getMovieById:', error);
        callback({
          code: grpc.status.INTERNAL,
          details: 'Internal Server Error',
        });
      }
    },
  });

  // adding the genre service to the server
  server.addService(genresProto.GenreService.service, {
    getAllGenres: async (_, callback) => {
      const genres = await getGenres({});
      const response = {
        genres: genres,
      };
      callback(null, response);
    },
  });

  // binding the server and specifying the url and port
  server.bindAsync(
    `0.0.0.0:${grpcPort}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log(`gRpc server running at http://0.0.0.0:${port}`);
      server.start();
    },
  );
};

// // running the gRPC server
// runGrpcServer();

module.exports = {
  runGrpcServer,
};

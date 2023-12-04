const { Router } = require('express');
const movieController = require('../controllers/movie.controller');
const genericResponse = require('../helpers/generic-response.helper');
const { upload } = require('../middlewares/multer.middleware');
const {
  verifyAccessToken,
} = require('../middlewares/authentication.middleware');
const { checkRole } = require('../middlewares/checkRole.middleware');
const movieValidator = require('../validators/movie.validator');
const movieSerializer = require('../serializers/movie.serializer');

const router = Router();

router.get(
  '/',
  verifyAccessToken,
  checkRole(['admin']),
  movieController.getMovies,
  movieSerializer.getMovies,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  verifyAccessToken,
  checkRole(['admin']),
  movieController.getMovie,
  movieSerializer.getMovie,
  genericResponse.sendResponse,
);

router.post(
  '/',
  verifyAccessToken,
  checkRole(['admin']),
  upload, // multer middleware for file upload
  movieValidator.createMovieSchema,
  movieController.uploadMovie,
  movieSerializer.uploadUpdateMovie,
  genericResponse.sendResponse,
);

router.patch(
  '/:id',
  verifyAccessToken,
  checkRole(['admin']),
  movieValidator.updateMovieSchema,
  movieController.updateMovie,
  movieSerializer.uploadUpdateMovie,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  verifyAccessToken,
  checkRole(['admin']),
  movieController.deleteMovie,
  genericResponse.sendResponse,
);

module.exports = router;

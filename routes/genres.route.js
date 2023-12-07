const { Router } = require('express');
const genreController = require('../controllers/genre.controller');
const genericResponse = require('../helpers/generic-response.helper');
const {
  verifyAccessToken,
} = require('../middlewares/authentication.middleware');
const { checkRole } = require('../middlewares/checkRole.middleware');
const genreSerializer = require('../serializers/genre.serializer');

const router = Router();

router.get(
  '/',
  verifyAccessToken,
  checkRole(['admin']),
  genreController.getGenres,
  genreSerializer.getGenres,
  genericResponse.sendResponse,
);

module.exports = router;

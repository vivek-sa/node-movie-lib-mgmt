const { Router } = require('express');

const adminController = require('../../controllers/admin.controller');
const genericResponse = require('../../helpers/generic-response.helper');
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require('../../middlewares/authentication.middleware');
const { checkRole } = require('../../middlewares/checkRole.middleware');
const adminValidator = require('../../validators/admin.validator');
const adminSerializer = require('../../serializers/admin.serializer');

const router = Router();

router.post(
  '/login',
  adminValidator.loginAdminSchema,
  adminController.loginAdmin,
  genericResponse.sendResponse,
);

router.delete(
  '/logout',
  verifyAccessToken,
  checkRole(['admin']),
  adminController.logoutAdmin,
  genericResponse.sendResponse,
);

router.post(
  '/register',
  verifyAccessToken,
  checkRole(['admin']),
  adminValidator.registerAdminSchema,
  adminController.registerAdmin,
  adminSerializer.registerAdmin,
  genericResponse.sendResponse,
);

router.post(
  '/refresh-token',
  verifyRefreshToken,
  adminController.refreshToken,
  genericResponse.sendResponse,
);

module.exports = router;

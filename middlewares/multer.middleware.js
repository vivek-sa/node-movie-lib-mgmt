const multer = require('multer');
const path = require('path');
const { commonErrorHandler } = require('../helpers/error-handler.helper');

const storage = multer.memoryStorage();

const { FILE_UPLOAD_LIMIT_IN_MB } = process.env;
const fileUploadLimit = parseInt(FILE_UPLOAD_LIMIT_IN_MB);

// multer middleware for performing file validation and parsing multipart form data
const upload = (req, res, next) => {
  // multer upload object for middleware
  const multerUpload = multer({
    storage: storage,
    // Define limits for uploaded files
    limits: {
      fileSize: fileUploadLimit * 1024 * 1024, // Maximum file size in bytes (converted from MB)
    },
    // Define a file filter function to restrict allowed file types
    fileFilter: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      if (!['.mp4', '.mov', '.flv', '.mkv'].includes(ext)) {
        return callback(new Error('only video files are allowed'));
      }
      callback(null, true);
    },
  }).single('movie_file');

  multerUpload(req, res, (err) => {
    if (err) {
      // Errors, such as file format not allowed, or file size exceeded
      commonErrorHandler(req, res, err.message, 400, err);
    } else {
      // No error, move on to the next middleware
      next();
    }
  });
};

module.exports = {
  upload,
};

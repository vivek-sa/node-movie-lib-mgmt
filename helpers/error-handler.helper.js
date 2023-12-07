const commonErrorHandler = async (
  req,
  res,
  message,
  statusCode = 500,
  error = null,
) => {
  // Initialize a default error message
  let errorMessage = 'Something went wrong. Please try again';

  // Check if a custom error message is provided, update errorMessage accordingly
  if (message) {
    errorMessage = message;
  }

  // If an error object is provided and it has a message property, update errorMessage
  if (error && error.message) {
    errorMessage = error.message;
  }

  // Attach the error object to the request for potential further handling in subsequent middleware or routes
  req.error = error;

  // Construct a response object with statusCode, an empty data object, and the determined errorMessage
  const response = {
    statusCode,
    data: {},
    message: errorMessage,
  };

  // Set the HTTP status code and send the response JSON to the client
  res.status(statusCode).json(response);
};

module.exports = {
  commonErrorHandler,
};

const { commonErrorHandler } = require('./error-handler.helper');

const validateRequest = (req, res, next, schema, requestParameterType) => {
  // Initialize an empty object to store request data
  let requestData = {};

  // Check the requestParameterType to determine where to extract data from (body, query, or params)
  if (requestParameterType === 'body') {
    requestData = req.body;
  } else if (requestParameterType === 'query') {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  // Validate the request data against the provided schema
  const { error, value } = schema.validate(requestData);

  // If validation is successful (no error), update the request object with the validated data and proceed to the next middleware
  if (!error) {
    if (requestParameterType === 'body') {
      req.body = value;
    } else if (requestParameterType === 'query') {
      req.query = value;
    } else {
      req.params = value;
    }
    return next();
  }

  // If there is a validation error, extract error details and create a comma-separated error message
  const { details } = error;
  const message = details.map((i) => i.message).join(',');

  // Call the commonErrorHandler function to handle the validation error and send an appropriate response (422 Unprocessable Entity)
  return commonErrorHandler(req, res, message, 422);
};

module.exports = {
  validateRequest,
};

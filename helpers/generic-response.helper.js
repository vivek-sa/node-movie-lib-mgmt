// It takes the first parameter (_) as a placeholder for an unused request object, and res (response object) as a parameter
const sendResponse = async (_, res) => {
  // Retrieve the HTTP status code from the response object, default to 200 if not present
  const statusCode = res.statusCode || 200;

  // Construct a response object with the retrieved statusCode, response data (default to an empty object if not present), and a success message
  const response = {
    statusCode,
    data: res.data || {},
    message: 'Success',
  };

  // Set the HTTP status code and send the response JSON to the client
  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
};

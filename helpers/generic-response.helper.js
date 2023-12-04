const sendResponse = async (_, res) => {
  const statusCode = res.statusCode || 200;
  const response = {
    statusCode,
    data: res.data || {},
    message: 'Success',
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
};

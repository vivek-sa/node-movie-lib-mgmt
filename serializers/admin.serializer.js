// register admin serializer function
const registerAdmin = async (req, res, next) => {
  // get the data from response data object
  const data = res.data.user || null;
  const response = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role,
  };
  // set the serialized data to the response object
  res.data.user = response;
  next();
};

module.exports = {
  registerAdmin,
};

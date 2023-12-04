const registerAdmin = async (req, res, next) => {
  const data = res.data.user || null;
  const response = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role,
  };
  res.data.user = response;
  next();
};

module.exports = {
  registerAdmin,
};

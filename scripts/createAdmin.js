const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const { connectToMongoDb } = require('../dbConnection');

// get the admin details from the env file
const {
  ADMIN_FIRST_NAME: adminFirstName,
  ADMIN_LAST_NAME: adminLastName,
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD: adminPassword,
} = process.env;

const addAdmin = async () => {
  try {
    // connect to the database
    await connectToMongoDb();

    // hash password using bcrypt
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // store the hashed password in the payload along with role as admin
    const userData = {
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    };

    // Insert user into the database
    await User.create(userData);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
};

addAdmin();

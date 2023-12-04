const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const { connectToMongoDb } = require('../dbConnection');

const {
  ADMIN_FIRST_NAME: adminFirstName,
  ADMIN_LAST_NAME: adminLastName,
  ADMIN_EMAIL: adminEmail,
  ADMIN_PASSWORD: adminPassword,
} = process.env;

const addAdmin = async () => {
  try {
    await connectToMongoDb();

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

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

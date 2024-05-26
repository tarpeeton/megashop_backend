const mongoose = require("mongoose");
require('dotenv').config();
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = dbConnect;

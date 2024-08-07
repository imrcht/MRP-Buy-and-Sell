const mongoose = require('mongoose');
require('dotenv').config();
// const secret = require("../security");

const MONGO_URI = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.vhg7m.mongodb.net/${process.env.databaseName}`;
const connectDB = async () => {
  try {
    console.log(MONGO_URI);
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDb Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;


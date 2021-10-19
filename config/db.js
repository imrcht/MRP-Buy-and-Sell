const mongoose = require("mongoose");

const dbInfo = require("../dbInfo");

const MONGO_URI = `mongodb+srv://${dbInfo.username}:${dbInfo.password}@cluster0.7ohbj.mongodb.net/${dbInfo.databaseName}`;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;

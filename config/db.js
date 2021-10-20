const mongoose = require("mongoose");
const confi = require('../secret');

const MONGO_URI = `mongodb+srv://${confi.user}:${confi.pwd}@cluster0.7ohbj.mongodb.net/MrpSaleProject`;
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

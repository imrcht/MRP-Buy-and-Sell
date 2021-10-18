const mongoose = require("mongoose");

const MONGO_URI = `mongodb+srv://MRP:collegeProject@cluster0.26gu3.mongodb.net/MRPsaleDb`;

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

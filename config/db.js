const mongoose = require("mongoose");
const confi = require("../secret");
const asyncHandler = require("../middleware/async");

const MONGO_URI = `mongodb+srv://${confi.user}:${confi.pwd}@cluster0.7ohbj.mongodb.net/MrpSaleProject`;
const connectDB = asyncHandler(async () => {
	const conn = await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log(`MongoDb Connected: ${conn.connection.host}`);
});

module.exports = connectDB;

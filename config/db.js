const mongoose = require("mongoose");
const confi = require("../security");
const asyncHandler = require("../middleware/async");

const MONGO_URI = `mongodb+srv://${confi.username}:${confi.password}@cluster0.7ohbj.mongodb.net/MrpSaleProject`;
const connectDB = asyncHandler(async () => {
	const conn = await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log(`MongoDb Connected: ${conn.connection.host}`);
});

module.exports = connectDB;

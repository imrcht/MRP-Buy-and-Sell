const mongoose = require("mongoose");

const secret = require("../security");

const MONGO_URI = `mongodb+srv://${secret.username}:${secret.password}@cluster0.7ohbj.mongodb.net/${secret.databaseName}`;
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

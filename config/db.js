const mongoose = require("mongoose");

const connectDB = async () => {
	const conn = await mongoose.connect(
		`mongodb+srv://${process.env.USER}:${process.env.PWD}@cluster0.vhg7m.mongodb.net/MRPsaleDB`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	);

	console.log(
		`MongoDb Connected: ${conn.connection.host}`,
	);
};

module.exports = connectDB;

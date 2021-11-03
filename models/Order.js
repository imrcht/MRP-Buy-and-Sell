const mongoose = require("mongoose");
const slugify = require("slugify");

const OrderSchema = new mongoose.Schema({
	productSold: {
		type: mongoose.Schema.ObjectId,
		ref: "Product",
	},
	soldTO: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		trim: true,
	},
	soldAt: {
		type: Date,
	},
	sold: {
		type: Boolean,
	},
});

module.exports = mongoose.model("Order", OrderSchema);

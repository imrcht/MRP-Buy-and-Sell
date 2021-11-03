const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "please add a Title"],
		trim: true,
		maxlength: [50, "Title cannot be more than of 50 characters"],
	},
	slug: String,
	category: {
		type: String,
		required: [true, "please add a type"],
		trim: true,
		maxlength: [50, "type cannot be more than of 50 characters"],
	},
	description: {
		type: String,
		required: [true, "please add a description"],
		trim: true,
		maxlength: [500, "Description cannot be more than of 500 characters"],
	},
	imagePath: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	cost: Number,
	seller: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		trim: true,
	},
});

// Product middleware to slugify the title
ProductSchema.pre("save", function (next) {
	this.slug = slugify(this.title, { lower: true });
	next();
});

module.exports = mongoose.model("Product", ProductSchema);

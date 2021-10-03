const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please add a name"],
		trim: true,
		maxlength: [50, "Name cannot be more than of 50 characters"],
	},
	slug: String,
	phone: {
		type: String,
		unique: true,
		maxlength: [20, "Phone "],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Please enter an email address"],
		match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
	},
	role: {
		type: String,
		enum: ["user"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Please enter password"],
		minlenght: 8,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	soldProducts: {
		type: [mongoose.Schema.ObjectId],
		ref: "Product",
	},
	buyedProducts: {
		type: [mongoose.Schema.ObjectId],
		ref: "Product",
	},
});

// User middleware to slugify the name and encrypting the password
UserSchema.pre("save", async function (next) {
	this.slug = slugify(this.name, { lower: true });
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Create and signedjwt and send it
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match entered password to hashed password
UserSchema.methods.matchPwd = async function (enteredPwd) {
	// this will return a promise
	return await bcrypt.compare(enteredPwd, this.password);
};

module.exports = mongoose.model("User", UserSchema);

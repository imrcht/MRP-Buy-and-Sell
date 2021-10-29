const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const crypto = require("crypto");

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
		required: [true, "please enter a phone number"],
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
		// select: false,
	},
	city: {
		type: String,
		required: [true, "Please enter a city"],
	},
	zipcode: {
		type: String,
		required: [true, "Please enter a zipcode"],
	},
	address: {
		type: String,
		required: [true, "Please enter a address"],
	},
	location: {
		//  Geo JSON point
		type: {
			type: String,
			enum: ["Point"],
			required: false,
		},
		coordinates: {
			type: [Number],
			required: false,
			index: "2dsphere",
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	listedProducts: {
		type: [mongoose.Schema.ObjectId],
		ref: "Product",
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

	next();
});

// GeoCode and create loacation field
UserSchema.pre("save", async function (next) {
	const loc = await geocoder.geocode(this.address);
	this.location = {
		type: "Point",
		coordinates: [loc[0].longitude, loc[0].latitude],
		formattedAddress: this.address,
		city: this.city,
		state: loc[0].stateCode,
		street: loc[0].streetName,
		zipcode: this.zipcode,
		country: loc[0].countryCode,
	};
	//Do not save address
	// this.address = undefined;
	next();
});

// return resetPassword token
UserSchema.methods.getResetPasswordToken = function () {
	// generate token
	let resetToken = crypto.randomBytes(20);
	// console.log("buffer of resetpwdtoken", resetToken);
	resetToken = resetToken.toString("hex");

	this.resetPasswordToken = crypto
		.createHash("sha1")
		.update(resetToken)
		.digest("hex");
	console.log(this.resetPasswordToken);
	this.resetPasswordExpire = Date.now() * 60 * 60;

	return resetToken;
};

module.exports = mongoose.model("User", UserSchema);

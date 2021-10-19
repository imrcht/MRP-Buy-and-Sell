const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

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
    required: [true, "Please enter a city"]
  },
  zipcode: {
    type: String,
    required: [true, "Please enter a zipcode"]
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
		formattedAddress: loc[0].formattedAddress,
		city: this.city,
		state: loc[0].stateCode,
		street: loc[0].streetName,
		zipcode: this.zipcode,
		country: loc[0].countryCode,
	};
	//Do not save address
	this.address = undefined;
	next();
});

module.exports = mongoose.model("User", UserSchema);

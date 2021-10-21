const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");
const secret = require("../secret");

exports.getLogin = (req, res, next) => {
	res.render("auth/login");
};

exports.getRegister = (req, res, next) => {
	res.render("auth/register");
};

exports.postLogin = asyncHandler(async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const user = await User.findOne({ email: email });

	if (!user) {
		return next(new errorResponse("User not found with this email", 404));
	}

	const isEqual = await bcrypt.compare(password, user.password);

	if (!isEqual) {
		return next(new errorResponse("Invalid credentials", 401));
	}

	// const token = jwt.sign({ email: email }, "secretsecretsecret");

	sendTokenResponse(user, 200, res);
});

exports.postRegister = asyncHandler(async (req, res, next) => {
	const name = req.body.name;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;
	const address = req.body.address;
	const city = req.body.city;
	const zipcode = req.body.zipcode;

	const hashedPw = await bcrypt.hash(password, 10);
	const newUser = new User({
		name: name,
		phone: phone,
		email: email,
		password: hashedPw,
		address: address,
		city: city,
		zipcode: zipcode,
	});

	const result = await newUser.save();

	sendTokenResponse(newUser, 201, res);
});

// create and send cookie and token
const sendTokenResponse = (user, statusCode, res) => {
	const token = jwt.sign({ id: user._id }, secret.jwt_secret_key, {
		expiresIn: secret.jwt_expire,
	});

	const options = {
		expires: new Date(
			Date.now() + secret.jwt_cookie_expire * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		user,
	});
};

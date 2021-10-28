const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");
const secret = require("../security");
const sendEmail = require("../utils/sendEmail");

// @desc 	Get login page
// @route 	GET users/login
// @access	public
exports.getLogin = (req, res, next) => {
	res.render("auth/login");
};

// @desc 	Get register page
// @route 	GET users/register
// @access	public
exports.getRegister = (req, res, next) => {
	res.render("auth/register");
};

// @desc 	Get ForgotPassword page
// @route 	GET users/forgotpassword
// @access	public
exports.getForgotPassword = (req, res, next) => {
	// res.render("forgot");
};

// @desc 	login a user
// @route 	POST users/login
// @access	Public
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

// @desc 	Register a user
// @route 	POST users/register
// @access	Public
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

	res.status(201).redirect("/users/login");
});

// @desc 	Logout User
// @route 	GET users/logout
// @access	Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
	});

	res.status(200).json({
		success: true,
		message: "User logged out",
	});
});

// @desc 	User details
// @route 	GET users/me
// @access	Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

// @desc 	Generate Forgot Password token
// @route 	POST users/forgotpassword
// @access	Public
exports.postForgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new errorResponse("user not found", 404));
	}

	const resetPasswordToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	resetUrl = `${req.protocol}://${req.get(
		"host",
	)}/users/resetpassword/${resetPasswordToken}`;
	const options = {
		message: `Your reset password url is ${resetUrl}`,
		email: user.email,
		subject: "Reset Password URL",
	};

	try {
		sendEmail(options);
		res.status(201).json({
			success: true,
			message: "email sent",
		});
	} catch (err) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });
		console.log(err);
		res.status(500).render("error", {
			msg: `Email could not be sent`,
			statuscode: 500,
		});
	}
});

// @desc 	Reset Password link
// @route 	PUT users/resetpassword/:resetToken
// @access	Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash("sha1")
		.update(req.params.resetToken)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: {
			$gt: Date.now(),
		},
	});

	if (!user) {
		res.status(400).render("error", {
			msg: "Invalid/ Expird Token",
			statuscode: 400,
		});
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	user.save();

	sendTokenResponse(user, 200, res);
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

	res.status(statusCode).cookie("token", token, options).redirect("/");
};

const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");
const secret = require("../security");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const sendSms = require("../utils/sendSms");
const sendEmailOtp = require("../utils/sendEmailOtp");

let registerdata;
var otp = {
	emailotp: "",
	smsotp: "",
};

// @desc 	Get login page
// @route 	GET users/login
// @access	public
exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		err: "",
		username: "",
		password: "",
	});
};

// @desc 	Get register page
// @route 	GET users/register
// @access	public
exports.getRegister = (req, res, next) => {
	res.render("auth/register", {
		err: "",
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		city: "",
		address: "",
		phone: "",
		zipcode: "",
	});
};

// @desc 	Get ForgotPassword page
// @route 	GET users/forgotpassword
// @access	public
exports.getForgotPassword = (req, res, next) => {
	res.render("auth/forgot", {
		msg: "You can reset your password here.",
	});
};

// @desc 	Get resetpassword page
// @route 	GET users/resetpassword/:resetToken
// @access	public
exports.getResetPassword = async (req, res, next) => {
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
		return res.status(400).render("error", {
			msg: "Invalid/ Expird Token",
			statuscode: 400,
		});
	}
	res.render("auth/reset");
};

// @desc 	Get User Products Page
// @route 	GET users//myproducts/:userId
// @access	Protected
exports.getMyProducts = asyncHandler(async (req, res, next) => {
	const userId = req.params.userId;
	const user = await User.findById(userId).populate("listedProducts");

	if (!user) {
		res.status(500).render("error", {
			msg: `user cannot be found`,
			statuscode: 500,
		});
	}

	const userListedProducts = user.listedProducts;

	res.json({ products: userListedProducts });
});

// @desc 	Register a user
// @route 	POST users/register
// @access	Public
exports.postRegister = asyncHandler(async (req, res, next) => {
	if (req.body.password !== req.body.confirmPassword) {
		return res.render("auth/register", {
			err: `Password Doesn't match`,
			name: req.body.name,
			email: req.body.email,
			password: "",
			confirmPassword: "",
			city: req.body.city,
			address: req.body.address,
			phone: req.body.phone,
			zipcode: req.body.zipcode,
		});
	}

	registerdata = req.body;
	registerdata.hashedPw = await bcrypt.hash(req.body.password, 10);

	// emailotp
	otp.emailotp = Math.round(Math.random() * 1000000);

	// smsotp
	otp.smsotp = Math.round(Math.random() * 1000000);

	// options for sms
	const smsoptions = {
		message: `This is your otp for registering in MRP Sale - ${otp.smsotp}`,
		number: req.body.phone,
	};
	const smsResult = sendSms(smsoptions);

	// options for email
	const emailoptions = {
		otp: otp.emailotp,
		email: req.body.email,
		subject: "Reset Password URL",
	};
	const emailResult = sendEmailOtp(emailoptions);

	res.render("auth/otp", {
		err: "",
		smsotp: "",
		emailotp: "",
	});
});

// exports.getotp = asyncHandler(async (req, res, next) => {
// 	res.render("getotp");
// });

exports.postOtp = asyncHandler(async (req, res, next) => {
	const emailotp = req.body.emailotp;
	const smsotp = req.body.smsotp;

	// Verifying email Otp
	if (emailotp != otp.emailotp) {
		return res.render("auth/otp", {
			err: "Wrong Email OTP !!",
			smsotp,
			emailotp: "",
		});
	}

	// verifying sms otp
	if (smsotp != otp.smsotp) {
		return res.render("auth/otp", {
			err: "Wrong Sms OTP!!",
			smsotp: "",
			emailotp,
		});
	}

	const newUser = new User({
		name: registerdata.name,
		phone: registerdata.phone,
		email: registerdata.email,
		password: registerdata.hashedPw,
		address: registerdata.address,
		city: registerdata.city,
		zipcode: registerdata.zipcode,
	});

	const result = await newUser.save();

	res.status(201).redirect("/users/login");
});

// @desc 	login a user
// @route 	POST users/login
// @access	Public
exports.postLogin = asyncHandler(async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email) {
		return res.status(400).render("auth/login", {
			err: "Please enter username",
			username: "",
			password,
		});
	}
	if (!password) {
		return res.status(400).render("auth/login", {
			err: "Please enter password",
			username: email,
			password: "",
		});
	}
	const user = await User.findOne({ email: email });

	if (!user) {
		return res.status(404).render("auth/login", {
			err: "User not found!!",
			username: "",
			password: "",
		});
	}

	const isEqual = await bcrypt.compare(password, user.password);

	if (!isEqual) {
		return res.status(401).render("auth/login", {
			err: "Invalid password!! Try again",
			username: email,
			password: "",
		});
	}

	sendTokenResponse(user, 200, res);
});

// @desc 	User details
// @route 	GET users/me
// @access	Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).populate("listedProducts");

	res.render("auth/profile", {
		user: user,
	});
});

// @desc Update User Profile
// @route POST users/updateme
// @access Private
exports.updateMe = asyncHandler(async (req, res, next) => {
	const updatedName = req.body.name;
	const updatedAddress = req.body.address;
	const updatedCity = req.body.city;
	const updatedState = req.body.state;
	const updatedCountry = req.body.country;
	const updatedZipcode = req.body.zipcode;

	const user = await User.findOne({ email: req.user.email }).populate(
		"listedProducts",
	);

	// if (!user) {
	// 	res.status(401).render("error", {
	// 		msg: "you cannot update yourself",
	// 		statuscode: 401,
	// 	});
	// }

	if (updatedName) {
		user.name = updatedName;
	}
	if (updatedCity) {
		user.city = updatedCity;
		user.location.city = updatedCity;
	}
	if (updatedZipcode) {
		user.zipcode = updatedZipcode;
		user.location.zipode = updatedZipcode;
	}
	if (updatedAddress) {
		user.location.formattedAddress = updatedAddress;
		user.address = updatedAddress;
	}
	if (updatedState) {
		user.location.state = updatedState;
	}
	if (updatedCountry) {
		user.location.country = updatedCountry;
	}

	await user.save({ validateBeforeSave: false });

	res.status(200).render("auth/profile", {
		user,
	});
});

// @desc 	Update User Password
// @route 	POST users/updatemypassword
// @access	Private to User itself
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	const isMatch = await bcrypt.compare(
		req.body.currentpassword,
		req.user.password,
	);
	if (!isMatch) {
		return next(new errorResponse(`Current password is incorrect`, 401));
	}
	const hashedPw = await bcrypt.hash(req.body.newpassword, 10);
	user.password = hashedPw;
	await user.save({ validateBeforeSave: false });

	sendTokenResponse(user, 200, res);
});

// @desc 	Logout User
// @route 	GET users/logout
// @access	Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
	});

	res.redirect("/");
});

// @desc 	Generate Forgot Password token
// @route 	POST users/forgotpassword
// @access	Public
exports.postForgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(404).render("auth/forgot", {
			msg: `No user found with email ${req.body.email} !! Try again`,
		});
	}

	const resetPasswordToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	resetUrl = `${req.protocol}://${req.get(
		"host",
	)}/users/resetpassword/${resetPasswordToken}`;
	const options = {
		resetUrl: resetUrl,
		email: user.email,
		subject: "Reset Password URL",
	};

	try {
		sendEmail(options);
		res.status(201).render("success", {
			email: user.email,
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
exports.postResetPassword = asyncHandler(async (req, res, next) => {
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
		return res.status(400).render("error", {
			msg: "Invalid/ Expird Token",
			statuscode: 400,
		});
	}

	const hashedPw = await bcrypt.hash(req.body.password, 10);
	user.password = hashedPw;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	user.save();

	res.status(200).redirect("/users/login");
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

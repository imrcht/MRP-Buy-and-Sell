const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");
const secret = require("../security");

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

// @desc 	Get single user
// @route 	GET users/:id
// @access	Private to Admin
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new errorResponse(`User with ${req.params.id} not found`, 404),
		);
	}

	res.status(200).json({
		success: true,
		user,
	});
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

// @desc 	Create User
// @route 	POST users/user
// @access	Private to Admin
exports.createUser = asyncHandler(async (req, res, next) => {
	const { name, email, phone, password, role } = req.body;

	// Create User in database
	const user = await User.create({
		name,
		email,
		phone,
		password,
		role,
	});

	res.status(201).json({
		success: true,
		message: `${user.role} of name ${user.name} created successfully`,
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

// @desc 	Get all User
// @route 	GET users/allusers
// @access	Private to Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advanceResult);
});

// @desc 	Update user details
// @route 	PUT users/:id
// @access	Private to Admin
exports.update = asyncHandler(async (req, res, next) => {
	let user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new errorResponse(`User with id ${req.params.id} not found`, 404),
		);
	}

	if (req.user.role !== "admin") {
		if (req.user.id !== req.params.id) {
			return next(
				new errorResponse(
					`${req.user.name} is not allowed to update another user`,
					401,
				),
			);
		}
	}

	// Update User
	user = await User.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
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

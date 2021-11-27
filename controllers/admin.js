const User = require("../models/User");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");

// @desc 	Get single user details
// @route 	GET admincontrol/:id
// @access	Private to Admin
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).render("error", {
			msg: `User with ${req.params.id} not found`,
			statuscode: 404,
		});
	}

	res.status(200).json({
		success: true,
		user: user,
	});
});

// @desc 	Create User
// @route 	POST admincontrol/user
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

// @desc 	Get all Users from the database
// @route 	GET admincontrol/allusers
// @access	Private to Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advanceResult);
});

// @desc 	Update user details:- checking whether if user is present or not, update user with findByIdAndUpdate method and send response back
// @route 	PUT admincontrol/:id
// @access	Private to Admin
exports.update = asyncHandler(async (req, res, next) => {
	let user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).render("error", {
			msg: `User with ${req.params.id} not found`,
			statuscode: 404,
		});
	}

	// if (req.user.role !== "admin") {
	// 	if (req.user.id !== req.params.id) {
	// 		return res.status(401).render("error", {
	// 			msg: `${req.user.name} is not allowed to update another user`,
	// 			statuscode: 401,
	// 		});
	// 	}
	// }

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

// @desc 	Delete single User:- check whether a user is present or not, deleting the user with remove method
// @route 	DELETE users/:id
// @access	Private to Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
	let user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new errorResponse(`User with id ${req.params.id} not found`, 404),
		);
	}
	const userRole = user.role;
	const username = user.name;
	user = user.remove();
	// console.log(user);

	res.status(200).json({
		success: true,
		message: `${username} of role ${userRole} removed by Admin`,
	});
});

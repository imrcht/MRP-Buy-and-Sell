const User = require("../models/User");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");

// @desc 	Get single user
// @route 	GET users/:id
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
		return res.status(404).render("error", {
			msg: `User with ${req.params.id} not found`,
			statuscode: 404,
		});
	}

	if (req.user.role !== "admin") {
		if (req.user.id !== req.params.id) {
			return res.status(401).render("error", {
				msg: `${req.user.name} is not allowed to update another user`,
				statuscode: 401,
			});
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

const User = require("../models/User");

// @desc 	Register User
// @route 	POST
// @access	Public
exports.Postregister = async (req, res, next) => {
	try {
		const { name, phone, email, password, role } = req.body;
		const user = await User.create({
			name,
			phone,
			email,
			password,
			role,
		});

		// Create token and cookie and send response
		sendTokenResponse(user, 201, res);
	} catch (err) {
		console.log(err);
		res.status(400).json({
			success: false,
			errpr: err.message,
		});
	}
};

// @desc 	Login User
// @route 	POST
// @access	Public
exports.Postlogin = async (req, res, next) => {
	const { email, password } = req.body;

	// check if field is not empty
	if (!email || !password) {
		res.status(400).json({
			success: false,
			error: "Enter email or password",
		});
	}

	// finding user
	const user = await User.findOne({ email: email }).select("+password");

	if (!user) {
		res.status(404).json({
			success: false,
			error: `User with email ${email} not found`,
		});
	}

	// match password
	const isMatch = await user.matchPwd(password);

	if (!isMatch) {
		res.status(401).json({
			success: false,
			error: "Invalid credentials",
		});
	}

	// Create token and cookie and send response
	sendTokenResponse(user, 200, res);
};

// create and send cookie and token
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	if (user.role === "admin") {
		res.status(statusCode)
			.cookie("token", token, options)
			.json({
				success: true,
				token: token,
				message: `Our Admin The ${user.name} has arrived `,
			});
	} else {
		res.status(statusCode)
			.cookie("token", token, options)
			.json({
				success: true,
				token: token,
				message: `${user.email} sucesss full `,
			});
	}
};

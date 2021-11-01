const asyncHandler = require("../middleware/async");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secret = require("../security");

exports.getAuth = asyncHandler(async (req, res, next) => {
	let token;
	token = req.cookies.token;

	// Make sure token is present
	if (!token) {
		return next(
			new errorResponse(
				"You are not authorized to access this route",
				401,
			),
		);
	}
	// Verify token
	const decoded = jwt.verify(token, secret.jwt_secret_key);

	console.log(decoded);

	req.user = await User.findById(decoded.id);
	console.log(req.user);
	res.render("home");
});

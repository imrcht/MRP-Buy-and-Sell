const asyncHandler = require("../middleware/async");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secret = require("../security");

exports.getAuth = asyncHandler(async (req, res, next) => {
	let token;
	token = req.cookies.token;

	if (token === "none" || !token) {
		return res.render("home", {
			name: undefined,
		});
	}

	// Verify token
	const decoded = jwt.verify(token, secret.jwt_secret_key);

	req.user = await User.findById(decoded.id);
	if (req.user) {
		return res.render("home", {
			name: req.user.name,
		});
	}
	res.render("home", {
		name: undefined,
	});
});

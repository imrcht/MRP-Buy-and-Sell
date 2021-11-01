const asyncHandler = require("../middleware/async");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secret = require("../security");

exports.getAuth = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.token;

  // Verify token
  if (token) {
    const decoded = jwt.verify(token, secret.jwt_secret_key);

    req.user = await User.findById(decoded.id);

    res.render("home", {
      name: req.user.name,
    });
  } else {
    res.render("home", {
      name: undefined,
    });
  }
});

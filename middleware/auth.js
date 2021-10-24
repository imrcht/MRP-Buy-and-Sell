const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");
const secret = require("../security");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.token;

  // Make sure token is present
  if (!token) {
    return next(
      new errorResponse("You are not authorized to access this route", 401)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret.jwt_secret_key);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(
      new errorResponse("You are not authorized to access this route", 401)
    );
  }
});

// specific role can perform specific operations
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(
          `User of role ${req.user.role} is not authorized to perform this action`,
          403
        )
      );
    }
    next();
  };
};

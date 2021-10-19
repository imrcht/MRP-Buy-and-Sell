const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.getRegister = (req, res, next) => {
  res.render("register");
};

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

  return res.redirect("/");
});

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

  await newUser.save();

  return res.redirect("/users/login");
});

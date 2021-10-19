const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorResponse=require('../middleware/error')

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.getRegister = (req, res, next) => {
  res.render("user_reg");
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error(
        "cannot find the user with this email, if new then please register"
      );
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("incorrect password");
      error.statusCode = 403;
      throw error;
    }

    // const token = jwt.sign({ email: email }, "secretsecretsecret");

    return res.status(201).json({ message: "login successfull" });
  } catch (err) {
    console.log(err);
  }
};

exports.postRegister = async (req, res, next) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;
  const address = req.body.address;
  const city = req.body.city;
  const zipcode = req.body.zipcode;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return next(
        new errorResponse('User already exist with this email', 403)
      )
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      phone: phone,
      email: email,
      password: hashedPw,
      address,
      city,
      zipcode
    });

    const result = await newUser.save();
    return res
      .status(201)
      .json({ message: "data inserted successfully!", result: result });
  } catch (err) {
    next(err)
  }
};

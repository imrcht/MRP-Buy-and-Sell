const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.getRegister = (req, res, next) => {
  res.render("register");
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

    return res.render("home", {
      isAuthenticated: true,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postRegister = async (req, res, next) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const error = new Error(
        "user already exist with this email, please try another or login"
      );
      error.statusCode = 403;
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      phone: phone,
      email: email,
      password: hashedPw,
    });

    await newUser.save();

    return res.redirect("/users/login");
  } catch (err) {
    console.log(err);
  }
};

const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User Not Found with entered Email.");
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      throw new Error("Invalid Password");
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    await req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/dashboard");
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
};

exports.postSignup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const c_password = req.body.c_password;

    if (password !== c_password) {
      throw new Error("Password donot match.");
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPw,
    });

    const saveUser = await user.save();

    console.log(saveUser);
    console.log("User Created Successfully.");

    res.redirect("/auth/login");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLogout = async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/home");
  });
};

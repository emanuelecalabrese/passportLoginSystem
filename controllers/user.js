const bcrypt = require("bcrypt");
const validator = require("validator");
const passport = require("passport");

const User = require("../models/user");

exports.getLogin = (req, res) => {
  res.status(200).render("login");
};

exports.getRegister = (req, res) => {
  res.status(200).render("register");
};

exports.postRegister = async (req, res) => {
  // Assigns the fields to the variables
  let { name, email, password, password2 } = req.body;

  // An array that contains the errors (if there are some)
  let errors = [];

  // check if one or more fields are missing
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check if the email is a valid email
  if (!validator.isEmail(email)) {
    errors.push({ msg: "Invalid email address" });
  }

  // Check if the password and the confirm password matches
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check if the password is at least 6 characters long
  if (password.length < 6) {
    errors.push({ msg: "Password should be 6 characters" });
  }

  // if there are errors, it renders the same page with the error messages
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    try {
      const userExists = await User.findOne({ email });
      // If user already exists, it renders the same page with the error
      if (userExists) {
        errors.push({ msg: "User already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        // Hashes the password
        password = await bcrypt.hash(password, 12);

        // The user that is going to be created
        const user = new User({ name, email, password });
        console.log(user);

        // Saves the user
        await user.save();
        req.flash("success_msg", "You are now registered and can log in");
        res.status(200).redirect("/users/login");
      }
      // Error handling
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

exports.getLogout = (req, res) => {
  req.logOut();
  req.flash("success_msg", "Successfully logged out");
  res.status(200).redirect("/users/login");
};

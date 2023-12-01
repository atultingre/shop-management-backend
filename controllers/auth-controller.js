const passport = require("passport");
const User = require("../models/user-model");
const Jwt = require("jsonwebtoken");

// Home Logic
const home = async (req, res) => {
  try {
    res.status(200).send({ message: "Welcome to Login Page" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Registration Logic
const register = async (req, res) => {
  try {
    console.log(req.body);
    // Getting users data
    const { username, email, phone, password } = req.body;

    // Check email exists or not
    const userExists = await User.findOne({ email });

    // if already exists return message
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // if user not exists then add it
    const userCreated = await User.create({
      username,
      email,
      phone,
      password, // Password hashed in user-modal
    });

    // Use Passport's register method to create a new user
    res.status(201).json({
      message: "Registration successful",
      userId: userCreated._id.toString(),
    });
    authenticateAfterRegistration(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const authenticateAfterRegistration = (req, res) => {
  passport.authenticate("local")(req, res, () => {
    res.status(200).json({
      message: "Authentication successful",
      userId: req.user._id.toString(),
    });
  });
};

// Login Logic
const userLogin = async (req, res) => {
  try {
    // getting the login data
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    console.log(userExist);

    // Checking login user exists or not if not then sending message
    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // if user exists then compare the password
    const user = await userExist.comparePassword(password);

    // when the user exists and the password matched, the user gets logged in
    if (user) {
      res.status(200).json({
        message: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
      console.log(user);
    } else {
      // if login password doesn't match, then show the message
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Passport Login Logic
const passportLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

// Forgot password Logic
const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Check if the user with the provided email and phone exists
    const user = await User.findOne({ email, phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and store a reset token (you need to implement this method in your User model)
    const resetToken = await user.generateResetToken();
    await user.save();

    res.status(200).json({
      message: "Reset email sent successfully",
      resetToken, // Send the reset token to the frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password Logic
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    // Check if the reset token is valid
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add the new functions to module.exports
module.exports = {
  home,
  register,
  userLogin,
  passportLogin,
  forgotPassword,
  resetPassword,
};

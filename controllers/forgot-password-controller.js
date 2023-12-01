// forgot-password-controller.js
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Check if the user with the provided email and phone exists
    const user = await User.findOne({ email, phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a reset token with a short expiration time (e.g., 15 minutes)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" }
    );

    // Send the reset token to the user's email or phone (implement this part)

    res.status(200).json({ message: "Reset token sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify the reset token
    const decodedToken = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);

    // Find the user associated with the decoded token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Hash the new password and update the user's password
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRound);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Invalid token or password update failed" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the current password matches
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and update the user's password
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRound);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { forgotPassword, verifyResetToken, updatePassword };

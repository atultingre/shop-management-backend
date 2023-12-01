const express = require("express");
const authControllers = require("../controllers/auth-controller");
const router = express.Router();

// Login Route
router.route("/").get(authControllers.home);

// Registration Route
router.route("/register").post(authControllers.register);

// Login Route
router.route("/login").post(authControllers.userLogin);

// forgot password Route
router.route("/forgot-password").post(authControllers.forgotPassword);

// reset password Route
router.route("/reset-password").post(authControllers.resetPassword);

module.exports = router;

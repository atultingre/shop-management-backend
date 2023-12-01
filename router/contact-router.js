const express = require("express");
const router = express.Router();
const contactForm = require("../controllers/contact-controller")

// Contact Route
router.route("/contact").post(contactForm);

module.exports = router;

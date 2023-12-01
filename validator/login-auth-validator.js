const { z } = require("zod");

// creating schema for login page using zod and added checks
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is Required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 chars" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  password: z
    .string({ required_error: "Password is Required" })
    .min(6, { message: "Password must be at least of 6 chars" })
    .max(1024, { message: "Password can't be grater than 1024 characters" }),
});

module.exports = loginSchema;

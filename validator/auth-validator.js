const { z } = require("zod");

// creating schema for registration page using zod and added checks
const signupSchema = z.object({
  username: z
    .string({ required_error: "Name is Required" })
    .trim()
    .min(3, { message: "Name must be at least of 3 chars" })
    .max(255, { message: "Name must not be more than 255 characters" }),
  email: z
    .string({ required_error: "Email is Required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 chars" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  phone: z
    .string({ required_error: "Phone is Required" })
    .trim()
    .min(10, { message: "Phone must be at least of 10 chars" })
    .max(20, { message: "Phone must not be more than 255 characters" }),
  password: z
    .string({ required_error: "Password is Required" })
    .min(6, { message: "Password must be at least of 6 chars" })
    .max(1024, { message: "Password can't be grater than 1024 characters" }),
});

module.exports = signupSchema;

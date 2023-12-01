const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiry: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);
// secure the password with bcrypt
// pre method works before saving the data
userSchema.pre("save", async function (next) {
  // get the user
  const user = this;

  // check password is bcrypted or not
  if (!user.isModified("password")) {
    next();
  }

  // if not then add the hash
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

// json web token
// Created instence method from user schema we can create methods as much we can
userSchema.methods.generateToken = async function () {
  try {
    // which conent we want in jwt token we are adding here and returning it.
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      // Adding the secred key here
      process.env.JWT_SECRET_KEY,
      // Addining expiration time not required it is optional if we want then add it.
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// Compare the login user password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Instance method to generate a reset token
userSchema.methods.generateResetToken = async function () {
  if (this.resetToken && this.resetTokenExpiry > Date.now()) {
    return this.resetToken;
  }

  const resetToken = Math.random().toString(36).slice(2);
  this.resetToken = resetToken;
  this.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
  return resetToken;
};

// Define the model or collection name
const User = new mongoose.model("User", userSchema);

module.exports = User;

const passport = require("passport");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

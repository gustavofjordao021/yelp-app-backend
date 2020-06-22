const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

// const mongoose = require("mongoose");
// const User = require("../../models/User.model");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3001/auth/facebook/callback",
      profileFields: ["id", "emails", "displayName", "photos"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Test");
      console.log(profile);
    }
  )
);

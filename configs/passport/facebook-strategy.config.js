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
    (req, accessToken, refreshToken, profile) => {
      console.log("Test");
      console.log(req);
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
    }
  )
);

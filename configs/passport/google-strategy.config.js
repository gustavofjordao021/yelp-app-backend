const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("Profile ===> ", profile);
      const { provider, given_name, email, picture } = profile;
      if (!picture) {
        const user = User.create({
          provider,
          username: given_name,
          email,
        });
        console.log("User created ===> ", user);
        await done(null, user);
      } else {
        const user = User.create({
          provider,
          username: given_name,
          email,
          avatar: picture,
        });
        console.log("User created ===> ", user);
        await done(null, user);
      }
    }
  )
);

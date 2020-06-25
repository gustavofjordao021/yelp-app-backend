const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/success/google",
    },
    async function (accessToken, refreshToken, profile, done) {
      const { provider, given_name, email, picture } = profile;
      if (!picture) {
        const user = await User.create({
          provider,
          username: given_name,
          email,
        });
        await done(null, user);
      } else {
        const user = await User.create({
          provider,
          username: given_name,
          email,
          avatar: picture,
        });
        await done(null, user);
      }
    }
  )
);

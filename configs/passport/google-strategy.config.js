const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../../models/User.model");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/success/google",
    },
    async function (accessToken, refreshToken, profile, done) {
      const { email, picture, provider, given_name, family_name } = profile;
      await User.findOne({ email: email }).then(async (user) => {
        if (!user) {
          if (!picture) {
            const user = await User.create({
              provider,
              username: given_name,
              firstName: given_name,
              lastName: family_name,
              email,
            });
            done(null, user);
          } else {
            const user = await User.create({
              provider,
              username: given_name,
              firstName: given_name,
              lastName: family_name,
              email,
              avatar: picture,
            });
            done(null, user);
          }
        } else {
          done(null, user);
        }
      });
    }
  )
);

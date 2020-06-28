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
    function (accessToken, refreshToken, profile, done) {
      const { provider, given_name, email, picture } = profile;
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          if (!picture) {
            const user = User.create({
              provider,
              username: given_name,
              email,
            });
            done(null, user);
          } else {
            const user = User.create({
              provider,
              username: given_name,
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

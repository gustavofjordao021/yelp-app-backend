const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const mongoose = require("mongoose");
const User = require("../../models/User.model");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3001/",
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      const { email, first_name } = profile._json;
      const userData = {
        email,
        username: first_name,
      };
      User.create(userData)
        .then((user) => {
          req.login(user, (err) => {
            if (err)
              return res.json({
                errorMessage: "Something went wrong with login!",
              });
            console.log(user);
            res.json({ user });
          });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            res.json({ errorMessage: "test error" });
          } else if (err.code === 11000) {
            res.json({
              errorMessage:
                "Username and email need to be unique. Either username or email is already used.",
            });
          } else {
            next(err);
          }
        });
      done(null, profile);
    }
  )
);

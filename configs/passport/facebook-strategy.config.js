const passport = require("passport");
const User = require("../../models/User.model");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3001/auth/success/facebook",
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      const { provider, name, email, picture } = profile;
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          if (!picture) {
            const user = User.create({
              provider,
              username: name.givenName,
              email,
            });
            done(null, user);
          } else {
            const user = User.create({
              provider,
              username: name.givenName,
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

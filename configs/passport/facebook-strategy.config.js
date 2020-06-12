const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3001/",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(function (err, user) {
        if (err) {
          return done(err);
        }
        done(null, user);
      });
    }
  )
);

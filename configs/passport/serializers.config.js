const passport = require("passport");
const User = require("../../models/User.model");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  await User.findById(id, function (err, user) {
    if (!err) done(null, user);
    else done(err, null);
  });
});

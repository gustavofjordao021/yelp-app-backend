const passport = require("passport");
const User = require("../../models/User.model");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  console.log("Id ====> ", id);
  await User.findById(id, function (err, user) {
    console.log("Deserialized user ====> ", user);
    if (!err) done(null, user);
    else done(err, null);
  });
});

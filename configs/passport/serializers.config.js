const passport = require("passport");
const User = require("../../models/User.model");

// passport.serializeUser(async (loggedInUser, next) => {
//   await console.log("User ====> ", loggedInUser);
//   await next(null, loggedInUser._id);
// });

// passport.deserializeUser((userIdFromSession, next) => {
//   User.findById(userIdFromSession)
//     .then((fullUserDoc) => next(null, fullUserDoc))
//     .catch((err) => next(err));
// });

passport.serializeUser(async (user, next) => {
  await console.log("User ====> ", user);
  next(null, user);
});

passport.deserializeUser((userIdFromSession, next) => {
  next(null, userIdFromSession);
});

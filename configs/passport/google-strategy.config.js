const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/success/google",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("Profile ===> ", profile);
      return done();
      //       console.log("Body: ", req.body);
      //   if (!username || !email || !password) {
      //     res.status(401).json({
      //       errorMessage:
      //         "All fields are mandatory. Please provide your username, email and password.",
      //     });
      //     return;
      //   }

      //   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
      //   if (!regex.test(password)) {
      //     res.json({
      //       errorMessage:
      //         "Password needs to have at least 8 characters, and must contain at least one number, one lowercase and one uppercase letter.",
      //     });
      //     return;
      //   }

      //   bcryptjs
      //     .genSalt(saltRounds)
      //     .then((salt) => bcryptjs.hash(password, salt))
      //     .then((hashedPassword) => {
      //       if (!avatar) {
      //         return User.create({
      //           username,
      //           email,
      //           passwordHash: hashedPassword,
      //         })
      //           .then((user) => {
      //             req.login(user, (err) => {
      //               if (err)
      //                 return res.json({
      //                   errorMessage: "Something went wrong with login!",
      //                 });
      //               user.passwordHash = undefined;
      //               res.json({ user });
      //             });
      //           })
      //           .catch((err) => {
      //             if (err instanceof mongoose.Error.ValidationError) {
      //               res.json({ errorMessage: "test error" });
      //             } else if (err.code === 11000) {
      //               res.json({
      //                 errorMessage:
      //                   "Username and email need to be unique. Either username or email is already used.",
      //               });
      //             } else {
      //               next(err);
      //             }
      //           });
      //       }
      //       return User.create({
      //         username,
      //         email,
      //         avatar,
      //         passwordHash: hashedPassword,
      //       })
      //         .then((user) => {
      //           req.login(user, (err) => {
      //             if (err)
      //               return res.json({
      //                 errorMessage: "Something went wrong with login!",
      //               });
      //             user.passwordHash = undefined;
      //             res.json({ user });
      //           });
      //         })
      //         .catch((err) => {
      //           if (err instanceof mongoose.Error.ValidationError) {
      //             res.json({ errorMessage: "test error" });
      //           } else if (err.code === 11000) {
      //             res.json({
      //               errorMessage:
      //                 "Username and email need to be unique. Either username or email is already used.",
      //             });
      //           } else {
      //             next(err);
      //           }
      //         });
      //     })
      //     .catch((err) => next(err));
      // });
    }
  )
);

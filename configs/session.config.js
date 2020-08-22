const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      cookie: {
        maxAge: 600000 * 1000,
        path: "/",
        sameSite: "lax",
        secure: true,
      },
      name: "sessionID",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 * 1000,
      }),
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sessionConfig.cookie.secure = true; // serve secure cookies
  }
};

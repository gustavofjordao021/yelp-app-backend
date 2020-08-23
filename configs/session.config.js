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
        domain: "https://plant-app-test.netlify.app/",
        sameSite: "none",
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
};

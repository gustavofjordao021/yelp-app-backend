const passport = require("passport");

const localStrategy = require("./local-strategy.config");
const facebook = require("./facebook-strategy.config");
const serializers = require("./serializers.config");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  serializers();
  facebook();
  localStrategy();
};

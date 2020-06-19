const passport = require("passport");

require("./local-strategy.config");
require("./facebook-strategy.config");
require("./google-strategy.config");
require("./serializers.config");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

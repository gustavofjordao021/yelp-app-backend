const passport = require("passport");

require("./serializers.config");
require("./local-strategy.config");
require("./google-strategy.config");
require("./facebook-strategy.config");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

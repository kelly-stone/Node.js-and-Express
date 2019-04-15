const LocalStrategy = require("passport-local").Strategy; //http://www.passportjs.org/docs/configure/
const User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "No User Found" });
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
};

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
        // if (!user.verifyPassword(password)) {
        //   return done(null, false);
        // }
        // return done(null, user);

        //https://github.com/kelektiv/node.bcrypt.js/#to-check-a-password
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      });
    })
  );
};

//https://github.com/jaredhanson/passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

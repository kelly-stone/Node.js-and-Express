const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt"); //https://github.com/kelektiv/node.bcrypt.js/

let router = express.Router();

let User = require("../models/user");

router.get("/register", function(req, res) {
  res.render("users/register");
});

router.post(
  "/register",
  [
    check("name")
      .isLength({ min: 1 })
      .withMessage("Name is required"),
    check("username")
      .isLength({ min: 1 })
      .withMessage("Username is required"),
    check("email")
      .isLength({ min: 1 })
      .withMessage("Email is required"),
    check("email") //https://github.com/chriso/validator.js/
      .isEmail()
      .withMessage("invalid email"),
    check("password", "invalid password")
      .isLength({ min: 1 })
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.password_confirmation) {
          // trow error if passwords do not match
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      })
  ],
  function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("users/register", {
        errors: errors.array()
      });
    } else {
      let user = new User(req.body);

      //https://github.com/kelektiv/node.bcrypt.js/
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) {
            console.log(err);
            return;
          }
          user.password = hash;

          user.save(function(err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash("success", "You are now registered");
              res.redirect("/");
            }
          });
        });
      });
    }
  }
);

module.exports = router;
const express = require("express");

let User = require("../models/user");

let router = express.Router();

router.get("/register", function(req, res) {
  res.render("users/register"); //going to create a users/register.pug
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
    check("password")
      .isLength({ min: 1 })
      .withMessage("Password is required")
  ],
  function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("users/new", {
        errors: errors.array()
      });
    } else {
      let user = new User(req.body);

      user.save(function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "user Added");
          res.redirect("/");
        }
      });
    }
  }
);

module.exports = router;

const express = require("express");
let router = express.Router();

router.get("/register", function(req, res) {
  res.render("users/register"); //going to create a users/register.pug
});

module.exports = router;

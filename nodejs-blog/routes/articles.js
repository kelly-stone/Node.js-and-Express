const express = require("express");
const { check, validationResult } = require("express-validator/check");

let router = express.Router();

let Article = require("../models/article");
let User = require("../models/user");

router.get("/", function(req, res) {
  Article.find({}, function(err, articles) {
    //collection is articles, but here first letter is capital and no s"
    res.render("articles/index", {
      articles: articles
    });
  });
});

router.get("/new", ensureAuthenticated, function(req, res) {
  res.render("articles/new", {
    //new.pug
    title: "Add Article"
  });
});

router.get("/:id", function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    User.findById(article.author, function(err, user) {
      res.render("articles/show", {
        article: article,
        author: user.name
      });
    });
  });
});

router.get("/:id/edit", ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render("articles/edit", {
      title: "Edit Article", //edit.pug #{title}
      article: article
    });
  });
}); //article edit then update

router.post(
  "/create",
  [
    check("title")
      .isLength({ min: 1 })
      .withMessage("Title is required"),
    check("body")
      .isLength({ min: 1 })
      .withMessage("Body is required")
    // check("author")
    //   .isLength({ min: 1 })
    //   .withMessage("Author is required")
  ],
  function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("articles/new", {
        title: "Add Article",
        errors: errors.array()
      });
    } else {
      let article = new Article(req.body);

      article.author = req.user.id;

      article.save(function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "Article Added");
          res.redirect("/");
        }
      });
    }
  }
);

router.post("/update/:id", function(req, res) {
  let query = { _id: req.params.id };

  Article.update(query, req.body, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article updated"); //once success, show "Article updated",https://github.com/visionmedia/express-messages
      res.redirect("/");
    }
  });
});

router.delete("/:id", function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if (err) {
      console.log(err);
    }
    req.flash("success", "Article Deleted"); //once success, show "Article Added",https://github.com/visionmedia/express-messages
    res.send("success"); //when success, it will run main.js success "/"
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}
module.exports = router;

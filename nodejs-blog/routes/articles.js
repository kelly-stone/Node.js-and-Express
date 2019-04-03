import express from "express";

let router = express.Router();

router.get("/", function(req, res) {
  Article.find({}, function(err, articles) {
    //collection is articles, but here first letter is capital and no s"
    res.render("index", {
      articles: articles
    });
  });
});

router.get("/articles/new", function(req, res) {
  res.render("new", {
    //form new.pug
    //new.pug
    title: "Add Article"
  });
});

router.get("/articles/:id", function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    // console.log(article);
    // return;
    res.render("show", {
      article: article
    });
  });
});

router.get("/articles/:id/edit", function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render("edit", {
      title: "Edit Article", //edit.pug #{title}
      article: article
    });
  });
}); //article edit then update

router.post(
  "/articles/create",
  [check("title").isEmail()], //www.express-validator.github.io/docs/index.html
  function(req, res) {
    //www.express-validator.github.io/docs/index.html
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
    }
    return;
    //console.log("ok");
    //return;
    let article = new Article();

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Article Added"); //once success, show "Article Added",https://github.com/visionmedia/express-messages
        res.redirect("/");
      }
    });
  }
);

router.post("/articles/update/:id", function(req, res) {
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

router.delete("/articles/:id", function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if (err) {
      console.log(err);
    }
    req.flash("success", "Article Deleted"); //once success, show "Article Added",https://github.com/visionmedia/express-messages
    res.send("success"); //when success, it will run main.js success "/"
  });
});

export default router;

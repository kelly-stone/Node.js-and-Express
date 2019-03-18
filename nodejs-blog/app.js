const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/nodejs-blog");
let db = mongoose.connection;

db.once("open", function() {
  console.log("Connected to Mongodb");
});

db.on("error", function(err) {
  console.log(err);
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

let Article = require("./models/article");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", function(req, res) {
  Article.find({}, function(err, articles) {
    res.render("index", {
      articles: articles
    });
  });
});

app.get("/articles/new", function(req, res) {
  res.render("new", {
    title: "Add Article"
  });
});

app.post("/articles/create", function(req, res) {
  let article = new Article(req.body);

  article.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

app.listen(5000, function() {
  console.log("Server started on port 5000...");
});

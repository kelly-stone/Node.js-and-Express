const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/nodejs-blog"); //to find out the localhost on command line type mongo then show db
let db = mongoose.connection;

db.once("open", function() {
  console.log("connected to Mongodb");
});

db.on("error", function(err) {
  console.log(err);
});

const app = express();

let Article = require("./models/article");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", function(req, res) {
  Article.find({}, function(err, articles) {
    //collection is articles, but here first letter is capital and no s"
    res.render("index", {
      articles: articles
    });
  });
});

app.get("/articles/new", function(req, res) {
  res.render("new", {
    //new.pug
    title: "Add Article"
  });
});

app.post("/articles/create", function(req, res) {
  console.log("ok");
  return;
});

app.listen(5000, function() {
  console.log("server started on port 5000...");
});

const express = require("express");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", function(req, res) {
  res.render("index", {
    title: "title is Node js blog"
  });
});

app.get("/articles/new", function(req, res) {
  res.render("new", {
    title: "Add Article"
  });
});

app.listen(3000, function() {
  console.log("server started on port 3000...");
});

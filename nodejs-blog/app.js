const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var session = require("express-session");

mongoose.connect("mongodb://localhost/nodejs-blog", { useNewUrlParser: true }); //to find out the localhost on command line type mongo then show db
let db = mongoose.connection;

db.once("open", function() {
  console.log("connected to Mongodb");
});

db.on("error", function(err) {
  console.log(err);
});

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
); //https://github.com/expressjs/session

app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
}); //https://github.com/visionmedia/express-messages Express 3+

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

let Article = require("./models/article");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

let articles = require("./routes/articles");
let users = require("./routes/users");

app.use("/articles", articles); //routes/articles.js
app.use("/users", users);

app.listen(5000, function() {
  console.log("server started on port 5000...");
});

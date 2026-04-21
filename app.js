// app.js
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const meetingsRouter = require("./routes/meetings");
const apiMeetingsRouter = require("./routes/api/api-meetings");

// Adds mongoose connection to MongoDB using the URI from environment variables
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// ----- View engine (EJS) -----
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ----- Middleware -----
app.use(logger("dev"));

// CORS — allow any origin
app.use(function (req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ----- Routes -----
app.use("/", indexRouter);
app.use("/meetings", meetingsRouter);
app.use("/api/meetings", apiMeetingsRouter);

// ----- 404 handler -----
app.use(function (req, res, next) {
  next(createError(404));
});

// ----- Error handler -----
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error"); // express-generator provides views/error.ejs
});

module.exports = app;
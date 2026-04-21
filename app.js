// app.js
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const meetingsRouter = require("./routes/meetings");

// Adds mongoose connection to MongoDB using the URI from environment variables
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// For assignment 4, require our new api router module
const apimeetings = require('./routes/api/api-meetings');

// install it as middleware
app.use('/api/meetings', apimeetings);



// ----- View engine (EJS) -----
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ----- Middleware -----
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ----- In-memory storage (no database) -----
// This was the assignment 2. In current assignment, I use database
// app.locals.meetings = app.locals.meetings || []; // array of meeting objects

// ----- Routes -----
app.use("/", indexRouter);
app.use("/meetings", meetingsRouter);

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
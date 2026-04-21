var express = require("express");
var router = express.Router();

/* 

// This is old code. I changed it to make it async and use the database instead of in-memory storage. I left it here for reference, but it is not used in the current version of the app.
router.get("/", function (req, res) {
  const meetings = req.app.locals.meetings || [];
  res.render("index", { title: "Brookline Town Meeting Transcriber", meetings });
}); */

const Meeting = require("../models/Meeting");

router.get("/", async function(req, res, next) {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.render("index", { title: "Brookline Town Meeting Transcriber", meetings });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
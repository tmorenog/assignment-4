var express = require("express");
var router = express.Router();

const meetingService = require("../services/meetingService");

router.get("/", async function(req, res, next) {
  try {
    const meetings = await meetingService.list();
    res.render("index", { title: "Brookline Town Meeting Transcriber", meetings });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
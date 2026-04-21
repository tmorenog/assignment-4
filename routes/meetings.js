// This file defines routes related to town meetings. It allows users to add new meeting videos via a form and stores them in an in-memory array. The main page ("/") will display the list of meetings, which is handled in the index.js route file.

const express = require("express");
const router = express.Router();
const createError = require("http-errors"); // Added this line after copilot suggested code around line 40 and following lines

router.get("/new", function(req, res) {
  res.render("meetings/new", { title: "Add Meeting" });
});

/* router.post("/", function(req, res) {

  const meeting = {
    title: req.body.title,
    videoUrl: req.body.videoUrl,
    meetingDate: req.body.meetingDate
  };

  req.app.locals.meetings.push(meeting);

  res.redirect("/");

}); */


const Meeting = require("../models/Meeting");

router.post("/", async function(req, res, next) {
  try {
    await Meeting.create({
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      meetingDate: req.body.meetingDate || undefined
    });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// Fetch the meeting and render the edit form
router.get("/:id/edit", async function(req, res, next) {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return next(createError(404));
    res.render("meetings/edit", { title: "Edit Meeting", meeting });
  } catch (err) {
    next(err);
  }
});

// Update the meeting
router.post("/:id", async function(req, res, next) {
  try {
    await Meeting.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      meetingDate: req.body.meetingDate || undefined
    });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// Delete the meeting
router.post("/:id/delete", async function(req, res, next) {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;



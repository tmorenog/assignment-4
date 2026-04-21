// This file defines routes related to town meetings. 

const express = require("express");
const router = express.Router();
const createError = require("http-errors"); // Added this line after copilot suggested code around line 40 and following lines

router.get("/new", function(req, res) {
  res.render("meetings/new", { title: "Add Meeting" });
});

const meetingService = require("../services/meetingService");

router.post("/", async function(req, res, next) {
  try {
    await meetingService.create({
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
    const meeting = await meetingService.find(req.params.id);
    if (!meeting) return next(createError(404));
    res.render("meetings/edit", { title: "Edit Meeting", meeting });
  } catch (err) {
    next(err);
  }
});

// Update the meeting
router.post("/:id", async function(req, res, next) {
  try {
    await meetingService.update(req.params.id, {
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
    await meetingService.remove(req.params.id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;



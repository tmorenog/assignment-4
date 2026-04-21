const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  videoUrl:    { type: String, required: true },
  meetingDate: { type: Date },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Meeting", meetingSchema);
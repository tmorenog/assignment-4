// services/meeting Service.js

const Meeting = require('../models/Meeting');

// list 
function list() {
  return Meeting.find().sort({ meetingDate: -1 });
}   

// find
function find(id) {
  return Meeting.findById(id);
}

// create
function create(obj) {
  const meeting = new Meeting(obj);
  return meeting.save();
}

// update
function update(id, data) {
  return Meeting.findByIdAndUpdate(id, data, { new: true });
}

// remove
function remove(id) {
  return Meeting.findByIdAndDelete(id);
}


module.exports = { list, find, create, update, remove };
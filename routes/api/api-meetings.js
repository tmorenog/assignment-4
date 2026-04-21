const express = require('express');
const router = express.Router();
const meetingService = require('../../services/meetingService');

// routing code goes here

// list
router.get('/', async (req, res, next) => {
  try {
    const meetingList = await meetingService.list();
    console.log('API: Found meeting:', meetingList);
    res.status(200).json(meetingList);
  } catch (err) {
    next(err);
  }
});

// find
router.get('/:id', async (req, res, next) => {
  try {
    const meeting = await meetingService.find(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.status(200).json(meeting);
   } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    next(err);
  }

});

// create
router.post('/', async (req, res, next) => {
  try {
    const newMeeting = await meetingService.create({
        title: req.body.title,
        videoUrl: req.body.videoUrl ? req.body.videoUrl : undefined,
        meetingDate: req.body.meetingDate || undefined
    });
    res.status(201).json(newMeeting);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
}        
});        


// update
router.put('/:id', async (req, res, next) => {
  try {
    const updatedMeeting = await meetingService.update(req.params.id, req.body);
    if (!updatedMeeting) return res.status(404).json({ message: 'Meeting not found' });
    res.status(200).json(updatedMeeting);
    } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    next(err);
  }

});

// remove
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedMeeting = await meetingService.remove(req.params.id);
    if (!deletedMeeting) return res.status(404).json({ message: 'Meeting not found' });
    res.status(200).json({ message: 'Meeting deleted successfully' });
   } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    next(err);
  }

});

// export our router
module.exports = router;
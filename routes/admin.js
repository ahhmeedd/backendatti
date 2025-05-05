const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Adherent = require('../models/Adherent');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

router.post('/:id/participate', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already participating' });
    }
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    if (new Date(event.endDate) < new Date()) {
      return res.status(400).json({ message: 'Event has ended' });
    }
    event.participants.push(req.user.id);
    await event.save();
    const admins = await Admin.find({});
    if (admins.length > 0) {
      const notificationPromises = admins.map(admin =>
        new Notification({
          message: `New participant in ${event.title}`,
          userId: admin._id,
        }).save()
      );
      await Promise.all(notificationPromises);
    } else {
      console.warn('No admins found to notify for event:', event.title);
    }
    res.json({ message: 'Joined event successfully' });
  } catch (error) {
    console.error('Error in participate endpoint:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
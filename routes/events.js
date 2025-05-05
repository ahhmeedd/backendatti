const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Existing routes (assumed)
router.get('/', async (req, res) => {
  const { page = 1, limit = 12, filter = '', admin = 'false' } = req.query;
  const query = filter ? { title: { $regex: filter, $options: 'i' } } : {};
  /*if (admin !== 'true') {
    query.endDate = { $gte: new Date() };
  }*/

  try {
    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Event.countDocuments(query);
    res.json({ events, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new endpoint
router.get('/recent', async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 }).limit(5);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing participant endpoint (assumed)
router.get('/:id/participants', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'firstName lastName email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event.participants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enhance participate endpoint
router.post('/:id/participate', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
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

    // Add notification for admin
    const admin = await User.findOne({ type: 'admin' });
    if (admin) {
      const notification = new Notification({
        message: `New participant in ${event.title}`,
        userId: admin._id,
      });
      await notification.save();
    }

    res.json({ message: 'Joined event successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing CRUD routes (assumed)
router.post('/', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
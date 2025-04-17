const express = require('express');
const Event = require('../models/Event');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');
const router = express.Router();

// Create event (Admin only)
router.post('/', isAdmin, validateEvent, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event (Admin only)
router.put('/:id', isAdmin, validateEvent, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('participants', 'firstName lastName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if participants exceed new maxParticipants
    if (event.participants.length > event.maxParticipants) {
      return res.status(400).json({
        message: `Cannot reduce maxParticipants below current participants count (${event.participants.length})`
      });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove event from adherent participations
    await Adherent.updateMany(
      { participations: event._id },
      { $pull: { participations: event._id } }
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events (for both roles)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const filter = req.user.role === 'adherent' ? 
      { endDate: { $gte: new Date() } } : {};
    
    const events = await Event.find(filter)
      .populate('participants', 'firstName lastName')
      .sort('-startDate');

    res.json(events.map(event => ({
      ...event.toObject(),
      availableSpots: event.maxParticipants - event.participants.length
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event details
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants', 'firstName lastName email profession');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      ...event.toObject(),
      availableSpots: event.maxParticipants - event.participants.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
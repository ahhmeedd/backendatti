/*const express = require('express');
const Event = require('../models/Event');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Must be present
const { validateAdherent } = require('../middleware/validation'); // Correct path
const Adherent = require('../models/Adherent'); // Should exist
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get all adherents with pagination and filters
router.get('/adherents', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;
    const query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Sorting
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [adherents, count] = await Promise.all([
      Adherent.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-password'),
      
      Adherent.countDocuments(query)
    ]);

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      adherents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new adherent (admin only)
router.post('/adherents', 
      isAdmin,        // From auth middleware
      validateAdherent, // From //middleware/validation
      async (req, res) => {  // Handler function
        try {
          const hashedPassword = await bcrypt.hash(req.body.password, 12);
          const adherent = new Adherent({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            birthdate: new Date(req.body.birthdate),
            profession: req.body.profession,
            telephone: req.body.telephone
          });
          
          
          await adherent.save();
          res.status(201).json(adherent);
        } catch (error) {
       if (error.code === 11000) {
       return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update adherent
router.put('/adherents/:id', isAdmin, validateAdherent, async (req, res) => {
  try {
    const adherent = await Adherent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!adherent) {
      return res.status(404).json({ message: 'Adherent not found' });
    }
    
    res.json(adherent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete adherent
router.delete('/adherents/:id', isAdmin, async (req, res) => {
  try {
    const adherent = await Adherent.findByIdAndDelete(req.params.id);
    
    if (!adherent) {
      return res.status(404).json({ message: 'Adherent not found' });
    }

    // Remove from event participations
    await Event.updateMany(
      { participants: adherent._id },
      { $pull: { participants: adherent._id } }
    );

    res.json({ message: 'Adherent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export adherents to PDF
router.get('/adherents/export', isAdmin, async (req, res) => {
  try {
    const adherents = await Adherent.find().select('-password');
    const doc = require('../utils/pdfGenerator').generateAdherentsPDF(adherents);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=adherents.pdf');
    
    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get adherent details
router.get('/adherents/:id', isAdmin, async (req, res) => {
  try {
    const adherent = await Adherent.findById(req.params.id)
      .select('-password')
      .populate('participations', 'title startDate');

    if (!adherent) {
      return res.status(404).json({ message: 'Adherent not found' });
    }
    
    res.json(adherent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/:id/participate
// Allows a user to join an event and notifies all admins
router.post('/:id/participate', auth, async (req, res) => {
  try {
    // Find the event
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check participation conditions
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already participating' });
    }
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    if (new Date(event.endDate) < new Date()) {
      return res.status(400).json({ message: 'Event has ended' });
    }

    // Add user to participants
    event.participants.push(req.user.id);
    await event.save();

    // Notify all admins
    const admins = await User.find({ type: 'admin' });
    if (admins.length > 0) {
      const notificationPromises = admins.map(admin =>
        new Notification({
          message: `New participant in ${event.title}`,
          userId: admin._id,
        }).save()
      );
      await Promise.all(notificationPromises);
    } else {
      console.warn('No admins found to notify');
    }

    res.json({ message: 'Joined event successfully' });
  } catch (error) {
    console.error('Error in participate endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;*/
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
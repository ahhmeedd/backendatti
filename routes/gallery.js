// routes/gallery.js (New)
const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, upload.single('media'), async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const media = new Media({
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      eventId: req.body.eventId,
      eventTitle: req.body.eventTitle,
    });
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
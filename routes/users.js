// routes/users.js (Edit: Add /count, /supervisors)
const express = require('express');
const router = express.Router();
const Adherent = require('../models/Adherent');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Existing routes (assumed)
router.get('/', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const { page = 1, limit = 10, filter = '', sortBy = 'firstName', sortOrder = 'asc' } = req.query;
  const query = filter ? {
    $or: [
      { firstName: { $regex: filter, $options: 'i' } },
      { lastName: { $regex: filter, $options: 'i' } },
      { email: { $regex: filter, $options: 'i' } },
    ],
  } : {};

  try {
    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-password');
    const total = await User.countDocuments(query);
    res.json({ users, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new endpoints
router.get('/count', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const total = await User.countDocuments();
    const association = await User.countDocuments({ isAssociationMember: true });
    res.json({ total, association });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/supervisors', async (req, res) => {
  try {
    const supervisors = await User.find({ position: { $exists: true }, quote: { $exists: true } })
      .select('firstName lastName position quote photoURL role isAssociationMember');
    res.json(supervisors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing CRUD routes (assumed)
router.post('/', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { firstName, lastName, email, birthDate, profession, type, isAssociationMember, role, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ firstName, lastName, email, birthDate, profession, type, isAssociationMember, role, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
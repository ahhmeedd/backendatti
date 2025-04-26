const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Adherent = require('../models/Adherent');
const Admin = require('../models/Admin');

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, birthDate, profession, password, isAssociationMember, role, isAdmin } = req.body;
  try {
    const Model = isAdmin ? Admin : Adherent;
    let user = await Model.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new Model({ firstName, lastName, email, birthDate, profession, password, isAssociationMember, role });
    await user.save();

    const payload = {
      id: user._id,
      isAssociationMember: user.isAssociationMember,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.status(201).json({ user: { id: user._id, firstName, lastName, email, isAssociationMember, role } });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Adherent.findOne({ email });
    let isAdmin = false;
    if (!user) {
      user = await Admin.findOne({ email });
      isAdmin = true;
    }
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      id: user._id,
      isAssociationMember: user.isAssociationMember || false,
      role: user.role || 'Admin',
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email, isAssociationMember: user.isAssociationMember || false, role: user.role || 'Admin' } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
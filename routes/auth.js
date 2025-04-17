const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Adherent = require('../models/Adherent');
const Admin = require('../models/Admin');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Adherent Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthdate, profession, telephone } = req.body;

    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'birthdate', 'profession', 'telephone'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if user exists
    const existingUser = await Adherent.findOne({ email }) || await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new adherent
    const adherent = new Adherent({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthdate: new Date(birthdate),
      profession,
      telephone
    });

    await adherent.save();

    res.status(201).json({
      message: 'Adherent registered successfully',
      user: {
        id: adherent._id,
        firstName: adherent.firstName,
        lastName: adherent.lastName,
        email: adherent.email,
        role: 'adherent'
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login (Both Admin and Adherent)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try to find admin first
    let user = await Admin.findOne({ email });
    let role = 'admin';

    // If not admin, check adherents
    if (!user) {
      user = await Adherent.findOne({ email });
      role = 'adherent';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie
    res.cookie('token', token, { 
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Return user data
    const userData = {
      id: user._id,
      email: user.email,
      role: role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    if (role === 'adherent') {
      userData.telephone = user.telephone;
      userData.profession = user.profession;
      userData.profession = user.profession;
    }

    res.json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
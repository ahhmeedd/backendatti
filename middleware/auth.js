/*const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Adherent = require('../models/Adherent');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.isAuthenticated = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Find user based on role
    let user;
    switch(decoded.role) {
      case 'admin':
        user = await Admin.findById(decoded.id).select('-password');
        break;
      case 'adherent':
        user = await Adherent.findById(decoded.id).select('-password');
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // 4. Attach user to request
    req.user = {
      id: user._id,
      role: decoded.role,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required'
    });
  }
  next();
};*/
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAssociationMember, role }
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
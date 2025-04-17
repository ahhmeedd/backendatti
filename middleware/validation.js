const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Adherent = require('../models/Adherent');
exports.validateRegistration = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .custom(async (value) => {
      const admin = await Admin.findOne({ email: value });
      const adherent = await Adherent.findOne({ email: value });
      if (admin || adherent) throw new Error('Email already exists');
    }),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase, one lowercase, and one number'),
  
  body('birthdate')
    .isDate().withMessage('Invalid birthdate format')
    .custom(value => {
      const birthDate = new Date(value);
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 13) throw new Error('Must be at least 13 years old');
      return true;
    }),
  
  body('profession')
    .trim()
    .notEmpty().withMessage('Profession is required'),
  
  body('telephone')
    .trim()
    .notEmpty().withMessage('Telephone is required')
    .matches(/^[0-9]{10}$/).withMessage('Invalid telephone number (10 digits required)'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

exports.validateEvent = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title too long (max 100 characters)'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description too long (max 500 characters)'),
  
  body('startDate')
    .isISO8601().withMessage('Invalid start date format')
    .custom((value, { req }) => new Date(value) < new Date(req.body.endDate))
    .withMessage('Start date must be before end date'),
  
  body('endDate')
    .isISO8601().withMessage('Invalid end date format'),
  
  body('maxParticipants')
    .isInt({ min: 1 }).withMessage('Must have at least 1 participant'),
  
  body('poster')
    .trim()
    .notEmpty().withMessage('Poster image is required')
    .isURL().withMessage('Invalid image URL format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];
//////////

exports.validateAdherent = [
  // First Name Validation
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/).withMessage('First name contains invalid characters'),

  // Last Name Validation
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/).withMessage('Last name contains invalid characters'),

  // Email Validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const existingUser = await Adherent.findOne({ email: value });
      const existingAdmin = await Admin.findOne({ email: value });
      
      // For updates, allow same email if it's the same user
      if (req.method === 'PUT') {
        if (existingUser && existingUser._id.toString() !== req.params.id) {
          throw new Error('Email already in use');
        }
        if (existingAdmin) throw new Error('Email already in use');
      } else {
        if (existingUser || existingAdmin) throw new Error('Email already registered');
      }
      return true;
    }),

  // Password Validation (only required for POST)
  body('password')
    .if((value, { req }) => req.method === 'POST')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  // Birthdate Validation
  body('birthdate')
    .isDate().withMessage('Invalid birthdate format')
    .custom(value => {
      const birthDate = new Date(value);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 13);

      if (birthDate < minDate) throw new Error('Invalid birthdate');
      if (birthDate > maxDate) throw new Error('Must be at least 13 years old');
      return true;
    }),

  // Profession Validation
  body('profession')
    .trim()
    .notEmpty().withMessage('Profession is required')
    .isLength({ max: 100 }).withMessage('Profession too long (max 100 characters)'),

  // Telephone Validation
  body('telephone')
    .trim()
    .notEmpty().withMessage('Telephone is required')
    .matches(/^(?:(?:\+|00)212|0)[5-7]\d{8}$/).withMessage('Invalid Moroccan telephone number'),

  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
    next();
  }
];

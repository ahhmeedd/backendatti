// server.js
/*const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { PORT } = require('./config/config');
const { validateEvent } = require('./middleware/validation');

// Import routes
const authRoutes = require('./routes/auth');
const adherentRoutes = require('./routes/adherents');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');

// Import seed function
const { seedDatabase } = require('./seed');

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  // Seed the database with sample data
  seedDatabase().then(() => {
    console.log('Database seeded successfully');
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));

// Routes
app.use('/api', authRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});
///api limitation
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);
app.use('/api/events', validateEvent);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/
// server.js (Edit: Add routes, rate limiting)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const contactRoutes = require('./routes/contact');
const galleryRoutes = require('./routes/gallery');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const { seedDatabase } = require('./seed');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/auth', limiter);

app.use('/api/', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static('uploads'));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit on connection failure
  });
// Seed the database with sample data
seedDatabase().then(() => {
  console.log('Database seeded successfully');
});
// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
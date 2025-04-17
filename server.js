// server.js
const express = require('express');
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
/*//api limitation
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);*/
app.use('/api/events', validateEvent);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

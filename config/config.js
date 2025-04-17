// config/config.js
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/patti',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  NODE_ENV: process.env.NODE_ENV || 'development'
};


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken'); 


const internRoutes = require('./routes/interns');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = 'sahil_kumar_from_ngp';


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  exposedHeaders: ['Authorization']
}));
app.use(express.json());

// JWT Authentication middleware
const authMiddleware = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers.authorization;
  // console.log('Auth header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  // console.log('Token:', token);

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    // console.log('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

// Public routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Intern Portal API',
    version: '1.0.0',
    endpoints: [
      '/api/interns',
      '/api/projects',
      '/api/auth/login',
      '/api/auth/verify'
    ]
  });
});

// Protected routes - Apply auth middleware
app.use('/api/interns', authMiddleware, internRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Export JWT secret for use in auth routes
module.exports.JWT_SECRET = JWT_SECRET;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
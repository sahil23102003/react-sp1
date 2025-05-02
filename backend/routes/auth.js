// routes/auth.js - JWT Authentication
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
 // Import JWT secret from server.js

 const JWT_SECRET = 'sahil_kumar_from_ngp'
// Hardcoded credentials for simplicity
// In a real app, store these in the database with hashed passwords
const validCredentials = {
  username: 'sahil',
  password: 'sahil123'
};

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials
  if (username === validCredentials.username && password === validCredentials.password) {
    // Create payload for JWT
    const payload = {
      username: username,
      role: 'admin'
    };
    
    // Generate JWT token
    // expires in 1 hour
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      token: token,
      user: { username, role: 'admin' }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid username or password' 
    });
  }
});

// Verify token route
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      isAuthenticated: false,
      message: 'No token provided'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.status(200).json({
      isAuthenticated: true,
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Invalid or expired token'
    });
  }
});

module.exports = router;
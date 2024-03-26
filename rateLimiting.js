const express = require('express');
const mysql = require('mysql');
const rateLimit = require('express-rate-limit');

const app = express();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database_name'
});

// Middleware for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Apply rate limiter to specific routes
app.use('/login', limiter);

// Middleware for brute force protection
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the IP is temporarily blocked due to too many failed login attempts
  connection.query('SELECT * FROM login_attempts WHERE ip = ? AND timestamp > DATE_SUB(NOW(), INTERVAL 15 MINUTE)', [req.ip], (err, results) => {
    if (err) {
      console.error('Error querying login attempts:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If there are too many recent failed attempts, block the IP
    if (results.length > 5) {
      return res.status(429).json({ message: 'Too many failed login attempts, please try again later' });
    }

    // Proceed with authentication logic if IP is not blocked
    // Your authentication logic goes here

    // For example:
    // if (authenticated) {
    //   // Clear any existing failed attempts for this IP
    //   connection.query('DELETE FROM login_attempts WHERE ip = ?', [req.ip], (deleteErr) => {
    //     if (deleteErr) {
    //       console.error('Error deleting login attempts:', deleteErr);
    //       return res.status(500).json({ message: 'Internal server error' });
    //     }
    //     // Proceed with successful login response
    //   });
    // } else {
    //   // Log failed login attempt
    //   connection.query('INSERT INTO login_attempts (ip) VALUES (?)', [req.ip], (insertErr) => {
    //     if (insertErr) {
    //       console.error('Error inserting login attempt:', insertErr);
    //       return res.status(500).json({ message: 'Internal server error' });
    //     }
    //     // Return authentication failure response
    //   });
    // }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

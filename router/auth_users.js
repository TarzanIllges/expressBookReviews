const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
let books = require('./booksdb.js'); // Adjust the path if needed

const JWT_SECRET = 'your_jwt_secret'; // Ensure this matches the secret used to sign the tokens

let users = [];

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(403).json({ message: 'Token is missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; // Attach user info to request
    next(); // Proceed to the route handler
  });
};

// Check if the username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Login a user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.user?.username; // Get username from authenticated user

  if (!review || !username) {
    return res.status(400).json({ message: 'Review or username is missing' });
  }

  if (books[isbn]) {
    // Add or update review
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: 'Review added or updated successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user?.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

module.exports = { authenticated: regd_users, isValid, users };
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
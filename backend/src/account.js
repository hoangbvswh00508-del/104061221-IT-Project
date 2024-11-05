const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Import dotenv to access environment variables

const router = express.Router();

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: '', // your MySQL password
    database: 'kse_office_rentals' // your database name
});

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Use the secret from the .env file
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id; // Attach the user ID to the request for further use
        req.userRole = decoded.role; // Attach the user role to the request for further use
        next(); // Call the next middleware or route handler
    });
}

// Define the route for creating an admin account
router.post('/create-admin', verifyToken, async (req, res) => {
    // Check if the requester is an admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
    }

    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into the database
        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'admin'], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Admin account created successfully', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

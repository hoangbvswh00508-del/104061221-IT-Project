const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kse_office_rentals'
});

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("Token received:", token);

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            }

            return res.status(500).json({ message: 'Failed to authenticate token', error: err.message });
        }

        console.log("Decoded token:", decoded);
        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    });
}


router.post('/create-account', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin' && req.userRole !== 'superAdmin') {
        return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
    }

    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Admin account created successfully', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

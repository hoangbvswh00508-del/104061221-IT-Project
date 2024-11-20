const express = require('express');
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

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

const validateAccountData = (username, email, phoneNum, password) => {
    const errors = [];

    if (!username || username.trim() === '') {
        errors.push('Username is required');
    }

    if (!email || !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
        errors.push('Invalid email format');
    }

    if (!phoneNum || !/^\d{10}$/.test(phoneNum)) {
        errors.push('Phone number must be 10 digits');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
};

router.post('/create-account', verifyToken, async (req, res) => {
    if (req.userRole !== 'Admin' && req.userRole !== 'Super Admin') {
        return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
    }

    const { username, password, email, phoneNum } = req.body;
    const validationErrors = validateAccountData(username, email, phoneNum, password);
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: validationErrors.join(', ') });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (username, password, email, phoneNum) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, phoneNum], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error: ' + err.message });
            }
            res.status(201).json({ message: 'Account created successfully', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});

module.exports = router;

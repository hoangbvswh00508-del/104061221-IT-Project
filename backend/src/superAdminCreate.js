const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kse_office_rentals'
});


router.post('/create-superadmin', async (req, res) => {
    const { username, password, email } = req.body;
    console.log("Received data:", { username, password, email }); // Move this line here for early logging
    console.log("Received request to create Super Admin");

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, 'Super Admin', email], 
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json({ message: 'Superadmin account created successfully', userId: results.insertId });
            }
        );
    } catch (error) {
        console.error('Error in hashing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;

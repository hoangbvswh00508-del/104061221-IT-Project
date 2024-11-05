const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accountRoutes = require('./account'); // Import the account routes
require('dotenv').config(); // Load environment variables
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: '', // your MySQL password
    database: 'kse_office_rentals' // your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log database errors if needed
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Password comparison error:', err); // Log comparison error if needed
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token }); // Send the token back to the client
        });
    });
});

// Use the account routes
app.use('/admin', accountRoutes); // Mount account routes under /admin

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);

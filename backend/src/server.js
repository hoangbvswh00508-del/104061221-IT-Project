const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accountRoutes = require('./account');
const superAdminCreateRoute = require('./superAdminCreate');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(superAdminCreateRoute);


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kse_office_rentals'
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
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// Use the account routes
app.use(accountRoutes);

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);

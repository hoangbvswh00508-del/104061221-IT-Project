const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accountRoutes = require("./account");
const superAdminCreateRoute = require("./superAdminCreate");
const { sendOtpEmail } = require("./emailService");
const crypto = require("crypto");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(superAdminCreateRoute);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kse_office_rentals",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error("Password comparison error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!match) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      });
    }
  );
});

app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  console.log("Received email for OTP:", email);

  // Generate OTP (6-digit random number)
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated OTP:", otp);

  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // expire time 10 mins
  console.log("OTP Expiration Time:", expirationTime);

  // Save OTP in the database
  db.query(
    "UPDATE users SET otp = ?, otp_expiration = ? WHERE email = ?",
    [otp, expirationTime, email],
    (err, results) => {
      if (err) {
        console.error("Error updating OTP in the database:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log(
        "OTP saved in database successfully, affected rows:",
        results.affectedRows
      );

      db.query(
        "SELECT otp FROM users WHERE email = ?",
        [email],
        (selectErr, selectResults) => {
          if (selectErr) {
            console.error("Error fetching OTP from the database:", selectErr);
          } else {
            console.log("Fetched OTP from database:", selectResults[0]?.otp);
          }

          // Send the OTP email
          sendOtpEmail(email, otp)
            .then(() => {
              console.log("OTP sent to email:", email);
              res.status(200).json({ message: "OTP sent successfully" });
            })
            .catch((error) => {
              console.error("Error sending OTP email:", error);
              res.status(500).json({ error: "Failed to send OTP" });
            });
        }
      );
    }
  );
});

app.post('/verify-otp', (req, res) => {
  const { email, otpEntered } = req.body;

  db.query('SELECT otp, otp_expiration, verify FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
          return res.status(400).json({ error: 'Email not found' });
      }

      const userOTP = results[0].otp;
      const otpExpiration = results[0].otp_expiration;
      const userVerify = results[0].verify;

      // Check if the OTP is expired
      if (new Date() > new Date(otpExpiration)) {
          return res.status(400).json({ error: 'OTP has expired' });
      }

      // Check if OTP is already verified
      if (userVerify) {
          return res.status(400).json({ error: 'OTP has already been verified' });
      }

      // Compare the entered OTP with the one stored in the database
      if (parseInt(otpEntered) === userOTP) {
          db.query(
              'UPDATE users SET verify = ? WHERE email = ?',
              [true, email],
              (updateErr, updateResult) => {
                  if (updateErr) {
                      return res.status(500).json({ error: 'Error updating verification status' });
                  }

                  return res.status(200).json({ message: 'OTP verified successfully, verification status updated' });
              }
          );
      } else {
          return res.status(400).json({ error: 'Invalid OTP' });
      }
  });
});


app.get("/get-user-data", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT username, email, phoneNum, role, verify FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user data" });
      }
      res.json(result[0]);
    }
  );
});

app.use(accountRoutes);
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

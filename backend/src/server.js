const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const accountRoutes = require("./account");
const superAdminCreateRoute = require("./superAdminCreate");
const { sendOtpEmail } = require("./emailService");


require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(superAdminCreateRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "kse_office_rentals",
});

// JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Token expired or invalid. Please log in again." });
    }
    req.user = user;
    next();
  });
};

const deleteMessageById = async (messageId) => {
  try {
    const deleteMessageQuery = 'DELETE FROM messages WHERE id = ?';
    const [messageResult] = await db.query(deleteMessageQuery, [messageId]);

    if (messageResult.affectedRows === 0) {
      throw new Error("Message not found");
    }
    const deleteNotificationQuery = 'DELETE FROM notifications WHERE id = ?';
    const [notificationResult] = await db.query(deleteNotificationQuery, [messageId]);

    if (notificationResult.affectedRows === 0) {
      console.log("No related notification found for this message");
    }

    return { messageDeleted: true, notificationDeleted: notificationResult.affectedRows > 0 };
  } catch (error) {
    console.error("Error deleting message or notification:", error);
    throw new Error("Failed to delete message or notification");
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Token expired or invalid",
      });
    }
    req.user = user;
    next();
  });
};


const checkRoleUpdatePermissions = (req, res, next) => {
  const { role } = req.user;

  if (role !== "Admin" && role !== "Super Admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

const canUpdateRole = (currentUserRole, targetUserRole, newRole) => {
  if (currentUserRole === "Super Admin") {
    return true;
  } else if (currentUserRole === "Admin") {
    if (targetUserRole === "Super Admin") {
      return false;
    }
    return true;
  }
  return false;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Received email for OTP:", email);

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    console.log("OTP Expiration Time:", expirationTime);

    await db.query(
      "UPDATE users SET otp = ?, otp_expiration = ? WHERE email = ?",
      [otp, expirationTime, email]
    );

    console.log("OTP saved in database");

    await sendOtpEmail(email, otp);
    console.log("OTP sent to email:", email);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in OTP process:", err);
    res.status(500).json({ error: "Failed to process OTP" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otpEntered } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT otp, otp_expiration, verify FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Email not found" });
    }

    const userOTP = rows[0].otp;
    const otpExpiration = rows[0].otp_expiration;
    const userVerify = rows[0].verify;

    if (new Date() > new Date(otpExpiration)) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (userVerify) {
      return res.status(400).json({ error: "OTP has already been verified" });
    }

    if (parseInt(otpEntered) === userOTP) {
      await db.query("UPDATE users SET verify = ? WHERE email = ?", [
        true,
        email,
      ]);
      return res.status(200).json({
        message: "OTP verified successfully, verification status updated",
      });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

app.get("/get-user-data", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT username, email, phoneNum, role, homeAddress, verify, avatar FROM users WHERE id = ?",
      [userId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

app.get("/users", authenticateJWT, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.put(
  "/update-role",
  authenticateJWT,
  checkRoleUpdatePermissions,
  async (req, res) => {
    const { id, role } = req.body;
    const { role: currentUserRole } = req.user;

    if (!id || !role) {
      return res.status(400).json({ message: "ID and role are required" });
    }

    const validRoles = [
      "Admin",
      "Super Admin",
      "Production Admin",
      "Finance Admin",
      "Network Admin",
    ];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (currentUserRole === "Admin" && (role === "Admin" || role === "Super Admin")) {
      return res.status(403).json({
        message: "Admin cannot assign Admin or Super Admin roles",
      });
    }

    try {
      const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const targetUserRole = rows[0].role;

      if (!canUpdateRole(currentUserRole, targetUserRole, role)) {
        return res
          .status(403)
          .json({ message: "You do not have permission to update this role" });
      }

      const query = "UPDATE users SET role = ? WHERE id = ?";
      await db.query(query, [role, id]);

      res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Error updating role" });
    }
  }
);
app.put("/update-profile", authenticateJWT, async (req, res) => {
  const { username, email, phoneNum, homeAddress } = req.body;
  const userId = req.user.id;

  if (!username || !email || !phoneNum) {
    return res.status(400).json({ message: "Username, email, and phone number are required" });
  }

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!phoneRegex.test(phoneNum)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  try {
    const [rows] = await db.query("SELECT email FROM users WHERE id = ?", [userId]);
    const currentEmail = rows[0]?.email;

    if (currentEmail !== email) {
      await db.query("UPDATE users SET verify = ? WHERE id = ?", [false, userId]);
    }

    const query =
      "UPDATE users SET username = ?, email = ?, phoneNum = ?, homeAddress = ? WHERE id = ?";
    const updateResult = await db.query(query, [username, email, phoneNum, homeAddress, userId]);

    console.log("Update result:", updateResult);

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
});



app.put("/change-password", authenticateJWT, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required" });
  }

  try {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = "UPDATE users SET password = ? WHERE id = ?";
    await db.query(query, [hashedPassword, userId]);
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});


app.post('/upload-avatar', authenticateJWT, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  
  try {
    const userId = req.user.id;
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, userId]);
    res.status(200).json({ success: true, avatarUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});
;

app.post('/create-superadmin', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required" });
  }

  try {

      const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (existingUser.length > 0) {
          return res.status(400).json({ error: "Username already taken" });
      }


      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
          'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
          [username, hashedPassword, 'superAdmin', email],
          (err, results) => {
              if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Internal server error' });
              }
              res.status(201).json({
                  message: 'Superadmin account created successfully',
                  userId: results.insertId,
              });
          }
      );
  } catch (error) {
      console.error('Error in hashing password:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/notifications", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `
      SELECT n.id, n.sender, n.subject, n.body, n.is_read, n.created_at, u.username AS sender_username, u.avatar AS sender_avatar
      FROM notifications n
      JOIN users u ON n.sender = u.username
      WHERE n.user_id = ?
    `;
    const [rows] = await db.query(query, [userId]);

    console.log("Fetched Notifications with is_read status:", rows);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});




app.get("/messages", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `
      SELECT m.id, m.sender_id, m.receiver_id, m.subject, m.body, m.created_at, u.username AS sender_username, u.avatar AS sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.receiver_id = ?
    `;
    const [rows] = await db.query(query, [userId]);

    console.log("Fetched Messages with Usernames and Avatars:", rows);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.post('/send-message', authenticateJWT, async (req, res) => {
  const { receiver_id, subject, body } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !subject || !body) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const insertMessageQuery = `
      INSERT INTO messages (sender_id, receiver_id, subject, body, created_at)
      VALUES (?, ?, ?, ?, NOW())`;

    const [messageResult] = await db.query(insertMessageQuery, [sender_id, receiver_id, subject, body]);

    const [userRows] = await db.query("SELECT username FROM users WHERE id = ?", [sender_id]);
    if (userRows.length === 0) {
      return res.status(400).json({ message: "Sender user does not exist" });
    }

    const senderUsername = userRows[0].username;

    const insertNotificationQuery = `
      INSERT INTO notifications (user_id, sender, subject, body, is_read, created_at)
      VALUES (?, ?, ?, ?, false, NOW())`;

    const [notificationResult] = await db.query(insertNotificationQuery, [receiver_id, senderUsername, subject, body]);

    console.log('Notification created:', notificationResult);

    res.status(200).send({ message: 'Message sent and notification created successfully' });
  } catch (err) {
    console.error('Error inserting message or notification:', err);
    res.status(500).send('Error sending message and creating notification');
  }
});

app.get("/get-user-id-by-email", authenticateJWT, async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    
    if (rows.length > 0) {
      return res.status(200).json({ id: rows[0].id });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({ message: "Error fetching user" });
  }
});

app.get("/notifications/unread-count", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `
      SELECT COUNT(*) AS unread_count
      FROM notifications
      WHERE user_id = ? AND is_read = false
    `;
    const [rows] = await db.query(query, [userId]);

    res.status(200).json({ unread_count: rows[0].unread_count });
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    res.status(500).json({ message: "Error fetching unread notifications count" });
  }
});

app.put('/notifications/:id/seen', authenticateJWT, async (req, res) => {
  try {
    const notificationId = req.params.id;

    const [result] = await db.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [notificationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.json({ message: 'Notification marked as seen' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delete-messages/:id', authenticateJWT, async (req, res) => {
  const messageId = req.params.id;

  try {
    const result = await deleteMessageById(messageId);

    if (result.messageDeleted) {
      res.status(200).json({ message: 'Message and related notification deleted successfully' });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete message and notification' });
  }
});


app.use(accountRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

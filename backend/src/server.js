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
      return res.status(403).json({ error: "Invalid or expired token." });
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

    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // expire time 10 mins
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
      "SELECT username, email, phoneNum, role, verify, avatar FROM users WHERE id = ?",
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
//Update profile information
app.put("/update-profile", authenticateJWT, async (req, res) => {
  const { username, email, phoneNum } = req.body;
  const userId = req.user.id;
  try {
    const query =
      "UPDATE users SET username = ?, email = ?, phoneNum = ? WHERE id = ?";
    await db.query(query, [username, email, phoneNum, userId]);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
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

app.use(accountRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

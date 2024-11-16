import React, { useState, useEffect, useRef } from "react";
import "./styles/profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNum: "",
    role: "",
    password: "",
    verify: false,
    avatar: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(userData.verify || false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(userData);
  const [newPassword, setNewPassword] = useState("");
  const [activityLog, setActivityLog] = useState([]);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/get-user-data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data) {
          setUserData({
            username: data.username,
            email: data.email,
            phoneNum: data.phoneNum,
            role: data.role,
            verify: data.verify,
            avatar: data.avatar
          });
          setUpdatedUserData({
            username: data.username,
            email: data.email,
            phoneNum: data.phoneNum,
            role: data.role,
            password: data.password,
            avatar: data.avatar
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("userData.verify in useEffect:", userData.verify);
    setIsVerified(userData.verify || false); // Ensure state is updated correctly
  }, [userData]);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/user-activity", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setActivityLog(data);
      } catch (error) {
        console.error("Error fetching activity log:", error);
      }
    };
    fetchActivityLog();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log("Changing:", id, " New Value:", value);
    setUpdatedUserData({ ...updatedUserData, [id]: value });
  };

  const saveProfileChanges = async () => {
    console.log("Before saving, isVerified:", isVerified);
    try {
      const response = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUserData),
      });
      const data = await response.json();
      if (data.message) {
        setMessage("Profile updated successfully");
        setUserData((prevState) => ({
          ...prevState,
          ...updatedUserData,
          verify: prevState.verify,
        }));

        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
        console.log("After saving, isVerified:", isVerified);
      } else {
        setMessage("Error updating profile");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating profile");
      setTimeout(() => setMessage(""), 3000);
    }
    console.log("After saving, isVerified:", isVerified);
    console.log("save button pressed");
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setMessage("Please enter your current password.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (data.message) {
        setMessage("Password updated successfully");
        setTimeout(() => setMessage(""), 3000);
        setCurrentPassword("");
        setNewPassword("");
        setIsChangingPassword(false);
      } else {
        setMessage("Error updating password");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating password");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setMessage("Please select a file first.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:5000/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.avatarUrl) {
        setMessage("Profile picture updated successfully");
        setUserData((prevState) => {
          return { ...prevState, avatar: data.avatarUrl };
        });
        localStorage.setItem("avatar", data.avatarUrl);
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } else {
        setMessage("Error updating profile picture");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      setMessage("Error updating profile picture");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const sendOtp = async () => {
    try {
      const trimmedEmail = userData.email.trim();
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await response.json();
      if (data.message) {
        setMessage("OTP sent to your email");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } else {
        setMessage("Error sending OTP");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      setMessage("Error sending OTP");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const verifyOtp = async () => {
    try {
      const trimmedEmail = userData.email.trim();
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, otpEntered: enteredOTP }),
      });
      const data = await response.json();
      if (data.message) {
        setIsVerified(true);
        setShowVerificationMessage(true); // Show the message
        setUserData((prevState) => {
          return { ...prevState, verify: true };
        });
        setMessage("Your email has been verified!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } else {
        setMessage("Invalid OTP");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      setMessage("Error verifying OTP");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };
  console.log("isVerified in render:", isVerified); // Log isVerified value
  console.log("isEditing in render:", isEditing);
  return (
    <div className="container">
      {message && (
        <div
          className={`alert alert-${isVerified ? "success" : "danger"}`}
          role="alert"
        >
          {message}
        </div>
      )}
      <div className="row">
        <div className="col-md-5 align-items-center justify-content-center avatar-container">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <img
              src={
                userData.avatar
                  ? `http://localhost:5000${userData.avatar}`
                  : "https://via.placeholder.com/300x400"
              }
              alt="User Avatar"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="file-input"
              onChange={handleUpload}
            />
          </div>
        </div>
        <div className="col-md-7">
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={userData.username}
                readOnly={true} // Ensure the field is always readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={isEditing ? updatedUserData.email : userData.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNum"
                value={isEditing ? updatedUserData.phoneNum : userData.phoneNum}
                onChange={handleInputChange}
                readOnly={!isEditing}
                maxLength={9}
                pattern="[0-9]*"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={userData.role}
                readOnly
              />
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-primary"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              onClick={saveProfileChanges}
              className="btn btn-success ms-3"
              disabled={!isEditing}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="btn btn-warning ms-3"
            >
              {isChangingPassword
                ? "Cancel Change Password"
                : "Change Password"}
            </button>
            {isChangingPassword && (
              <div className="mt-3">
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="btn btn-success"
                >
                  Change Password
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

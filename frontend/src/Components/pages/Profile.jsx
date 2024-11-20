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
    homeAddress: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(userData.verify || false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(userData);
  const [newPassword, setNewPassword] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
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
            avatar: data.avatar,
            homeAddress: data.homeAddress,
          });
          setUpdatedUserData({
            username: data.username,
            email: data.email,
            phoneNum: data.phoneNum,
            role: data.role,
            password: data.password,
            avatar: data.avatar,
            homeAddress: data.homeAddress,
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
    setIsVerified(userData.verify || false);
  }, [userData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log("Changing:", id, " New Value:", value);
    setUpdatedUserData({ ...updatedUserData, [id]: value });
  };

  const addMessage = (msg, type = "danger") => {
    setMessage((prevMessages) => [...prevMessages, { msg, type }]);
    setTimeout(() => {
      setMessage((prevMessages) => prevMessages.filter((message) => message.msg !== msg));
    }, 9000);
  };
  
  
   // Validation functions
   const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (newPassword) => {
    return newPassword.length >= 6;
  };

  const saveProfileChanges = async () => {
    let isValid = true;
  
    if (!validateEmail(updatedUserData.email)) {
      addMessage("Invalid email address.");
      isValid = false;
    }
  
    if (!validatePhone(updatedUserData.phoneNum)) {
      addMessage("Invalid phone number. Must be 10 digits.");
      isValid = false;
    }
  
    if (!isValid) return;
  
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUserData),
      });
  
      const data = await response.json();
  
      if (data.message) {
        addMessage("Profile updated successfully", "success");
        setUserData((prevState) => ({ ...prevState, ...updatedUserData, verify: prevState.verify }));
        setIsEditing(false);
      } else {
        addMessage("Error updating profile");
      }
    } catch (error) {
      console.error("Error while updating profile:", error);
      addMessage("Error updating profile");
    }
  };
  

  
  const handleChangePassword = async () => {
    if (!currentPassword) {
      setMessage("Please enter your current password.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
  
    // Apply validation here
    if (!validatePassword(currentPassword, newPassword)) {
      setMessage("Invalid new password. Must be at least 6 characters.");
      setTimeout(() => setMessage(""), 9000);
      return;
    }
  
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:5000/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
  
      const data = await response.json();
      if (data.message) {
        setMessage("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setIsChangingPassword(false);
      } else {
        setMessage("Error updating password");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating password");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setMessage("Please select a file first.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:5000/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error updating profile picture");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating profile picture");
      setTimeout(() => setMessage(""), 3000);
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
      const newMessage = {
        type: data.message === "OTP sent successfully" ? "success" : "danger",
        msg: data.message || "Error sending OTP",
      };

      setMessage([newMessage]);
      setTimeout(() => setMessage([]), 9000);
    } catch (error) {
      const errorMessage = {
        type: "danger",
        msg: "Error sending OTP",
      };
      setMessage([errorMessage]);
      setTimeout(() => setMessage([]), 9000);
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
        setShowVerificationMessage(true);
        setUserData((prevState) => ({
          ...prevState,
          verify: true,
        }));
        const successMessage = { type: "success", msg: "Your email has been verified!" };
        setMessage([successMessage]);
        setTimeout(() => setMessage([]), 9000);
      } else {
        const invalidOtpMessage = { type: "danger", msg: "Invalid OTP" };
        setMessage([invalidOtpMessage]);
        setTimeout(() => setMessage([]), 9000);
      }
    } catch (error) {
      const errorMessage = { type: "danger", msg: "Error verifying OTP" };
      setMessage([errorMessage]);
      setTimeout(() => setMessage([]), 9000);
    }
  };

  return (
    <div 
      className="container"
      style={{
        backgroundColor:"#fffefe",
        boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.5)",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      
  {message && Array.isArray(message) && message.map((msgObj, index) => (
    <div key={index} className={`alert alert-${msgObj.type}`} role="alert">
      {msgObj.msg}
    </div>
  ))}
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
                readOnly={true}
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
                maxLength={10}
                pattern="[0-9]*"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="homeAddress" className="form-label">
                Home Address
              </label>
              <input
                type="text"
                className="form-control"
                id="homeAddress"
                value={isEditing ? updatedUserData.homeAddress : userData.homeAddress}
                onChange={handleInputChange}
                readOnly={!isEditing}
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
            {!isVerified && (
              <div className="otp-container mt-3">
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="btn btn-success ms-3"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="btn btn-primary ms-3"
                >
                  Send OTP
                </button>
              </div>
            )}
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

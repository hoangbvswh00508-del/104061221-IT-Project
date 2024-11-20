import React, { useState } from "react";
import axios from "axios";

const AccountCreation = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [message, setMessage] = useState([]);
  const [error, setError] = useState([]);

  const validateForm = () => {
    const errors = [];
    if (!username || username.trim() === "") {
      errors.push({ type: "danger", msg: "Username is required" });
    }
    if (
      !email ||
      !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)
    ) {
      errors.push({ type: "danger", msg: "Invalid email format" });
    }
    if (!phoneNum || !/^\d{10}$/.test(phoneNum)) {
      errors.push({ type: "danger", msg: "Phone number must be 10 digits" });
    }
    if (!password || password.length < 6) {
      errors.push({
        type: "danger",
        msg: "Password must be at least 6 characters long",
      });
    }
    return errors;
  };

  const handleCreateAccount = async () => {
    setMessage([]);
    setError([]);
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError([
          {
            type: "danger",
            msg: "No token found. Please log in as an admin first.",
          },
        ]);
        return;
      }

      console.log("Creating account with data:", { username, password, email });

      const response = await axios.post(
        "http://localhost:5000/create-account",
        { username, password, email, phoneNum },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setUsername("");
        setPassword("");
        setEmail("");
        setPhoneNum("");
        setMessage([{ type: "success", msg: response.data.message }]);
      }
    } catch (err) {
      if (err.response) {
        setError([
          {
            type: "danger",
            msg: err.response.data.message || "Failed to create account",
          },
        ]);
      } else {
        setError([{ type: "danger", msg: "Network error" }]);
      }
      setMessage([]);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div
        className="card col-md-5"
        style={{
          fontFamily: "'Poppins', sans-serif",
          boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.5)",
        }}
      >
        <div className="card-body ml-3">
          <h2 
            className="card-title"
            style={{
              textAlign: "center",
              fontWeight: "700"
            }}
          >Create Account</h2>
          {message &&
            message.map((msgObj, index) => (
              <div
                key={index}
                className={`alert alert-${msgObj.type}`}
                role="alert"
              >
                {msgObj.msg}
              </div>
            ))}
          {error &&
            error.map((errObj, index) => (
              <div
                key={index}
                className={`alert alert-${errObj.type}`}
                role="alert"
              >
                {errObj.msg}
              </div>
            ))}
          <div className="form-group mb-2">
            <label className="col-sm-3 col-form-label">Username:</label>
            <input
              type="text"
              className="col-sm-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "45px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#61585826",
                width: "100%",
                fontSize:"1.2em",
                outline: "none",
              }}
            />
          </div>
          <div className="form-group mb-2">
            <label className="col-sm-3 col-form-label">Password:</label>
            <input
              type="password"
              className="col-sm-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "45px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#61585826",
                width: "100%",
                fontSize:"1.2em",
                outline: "none",
              }}
            />
          </div>
          <div className="form-group mb-2">
            <label className="col-sm-3 col-form-label">Email:</label>
            <input
              type="email"
              className="col-sm-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "45px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#61585826",
                width: "100%",
                fontSize:"1.2em",
                outline: "none",
              }}
            />
          </div>
          <div className="form-group mb-2">
            <label className="col-sm-3 col-form-label">Phone Number:</label>
            <input
              type="text"
              className="col-sm-4"
              maxLength={10}
              pattern="[0-9]*"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
              style={{
               display: "flex",
                flexDirection: "column",
                height: "45px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#61585826",
                width: "100%",
                fontSize:"1.2em",
                outline: "none",
              }}
            />
          </div>
          <div 
            className="buttonContainer"
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <button 
              onClick={handleCreateAccount}
              style={{
                backgroundColor: "rgb(73 145 255)",
                color:"white",
                margin: "10px auto",
                border: "none",
                borderRadius: "23px",
                padding: "10px 20px",

              }}
            >Create Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;

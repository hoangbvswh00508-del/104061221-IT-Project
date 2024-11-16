import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);

      // Clear cached avatar data
      localStorage.removeItem("avatar");

      // Fetch fresh user data
      await fetchUserData();

      console.log("Login successful:", response.data);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        console.error(
          "Login failed:",
          error.response.data.message || error.response.data
        );
      } else {
        console.error("Login failed:", error.message);
      }
    }
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/get-user-data", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    localStorage.setItem("avatar", data.avatar); // Store avatar in local storage
    // Update the state with user data as needed
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-dark">
      <div className="row w-100">
        <div className="col-md-7 d-flex flex-column justify-content-center align-items-center">
          <h1 style={{ fontSize: "7em" }}>KSE OFFICE SALE</h1>
          <button
            className="btn btn-outline-light mt-3 text-dark"
            style={{ fontSize: "2em", padding: "10px 20px" }}
          >
            Big office, big company
          </button>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="card p-4 bg-secondary text-white" id="login">
            <h3 className="card-title" style={{ fontSize: "3em" }}>
              Login
            </h3>
            <p>Glad you're back!</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {error && <p className="error">{error}</p>}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control mb-2 mt-2"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control mb-2 mt-2"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn w-100 btn-primary btn-block mt-3 justify-content-center align-items-center"
              >
                Login
              </button>
            </form>
            <a href="#" className="text-white mt-3">
              Forgot Password?
            </a>
            <div className="mt-3">
              <a href="#" className="text-white">
                {" "}
                Terms & Conditions
              </a>{" "}
              |
              <a href="#" className="text-white">
                {" "}
                Support
              </a>{" "}
              |
              <a href="#" className="text-white">
                {" "}
                Customer Care
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("auth_token", response.data.token);
      localStorage.removeItem("avatar");
      await fetchUserData();

      console.log("Login successful:", response.data);
      navigate("/dashboard");

    } catch (error) {
      if (error.response) {
        console.error(
          "Login failed:",
          error.response.data.message || error.response.data
        );
        setError(error.response.data.message || "Invalid username or password");
      } else {
        console.error("Login failed:", error.message);
        setError(error.message || "Login failed. Please try again.");
      }
    }
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get("http://localhost:5000/get-user-data", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    localStorage.setItem("avatar", data.avatar);
  };

  return (
    <div className="container-fluid bg-black d-flex align-items-center justify-content-center vh-100 text-dark mt-0 pt-5" style={{ paddingLeft: "4em" }}>
      <div className="row w-100">
        <div className="col-md-7 d-flex flex-column justify-content-center align-items-center mb-5">
          <h1 style={{ fontSize: "7em", color: "white" }}>KSE OFFICE SALE</h1>
          <button className="btn btn-outline-light mt-3"
            style={{ fontSize: "1.5em", padding: "20px 30px", border: "#fff solid 2px", fontStyle: "italic", fontWeight: "700", borderRadius: "0px" }}>
            Big office, big company
          </button>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="card p-4 text-white" id="login"
            style={{ backgroundColor: "rgb(158 158 158 / 33%)", border: "white 2px solid", borderRadius: "10px", backdropFilter: "blur(10px)", justifyItems: "left" }}>
            <h3 className="card-title" style={{ fontSize: "2em", justifyContents: "left" }}>Login</h3>
            <p>Glad you're back!</p>
            {error && <p className="error" style={{ color: "red", fontSize: "1.2em" }}>{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" style={{ display: "none" }}>Username</label>
                <input type="text"
                  className="form-control mb-2 mt-2 white-placeholder"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ backgroundColor: "transparent", height: "50px", color: "#ffffff", fontSize: "1.2em", borderRadius: "10px" }} />
              </div>
              <div className="form-group">
                <label htmlFor="password" style={{ display: "none" }}>Password</label>
                <input type="password"
                  className="form-control mb-2 mt-2 white-placeholder"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ backgroundColor: "transparent", height: "50px", color: "#ffffff", fontSize: "1.2em", borderRadius: "10px" }} />
              </div>
              <button type="submit"
                className="btn w-100 btn-primary btn-block mt-3 justify-content-center align-items-center"
                style={{ backgroundImage: "linear-gradient(to right, rgb(13, 128, 235), rgb(142 75 193), rgb(93 18 151))", border: "none", height: "60px", borderRadius: "15px", fontSize: "19px", fontWeight: "500" }}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

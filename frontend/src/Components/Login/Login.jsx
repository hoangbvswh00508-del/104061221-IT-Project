import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import googleImage from './google-logo.png';
import facebookImage from './facebook-logo.png';
import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState(''); // Store username
    const [email, setEmail] = useState(''); // Add email state
    const [password, setPassword] = useState(''); // Store password
    const [action, setAction] = useState('Login');
    const [error, setError] = useState(null); // To handle errors
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            console.log('Login successful:', response.data);
            navigate('/dashboard');
            // Handle successful login (e.g., store token, redirect user)
        } catch (error) {
            // Log the error response message if available
            if (error.response) {
                console.error('Login failed:', error.response.data.message || error.response.data);
            } else {
                console.error('Login failed:', error.message);
            }
            // Optionally, show an error message to the user
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-dark">
            <div className="row w-100">
                <div className="col-md-7 d-flex flex-column justify-content-center align-items-center">
                    <h1 style={{ fontSize: '7em'}}>KSE OFFICE SALE</h1>
                    <button className="btn btn-outline-light mt-3 text-dark" style={{ fontSize: '2em', padding: '10px 20px' }}>Big office, big company</button>
                </div>
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <div className="card p-4 bg-secondary text-white" id="login">
                        <h3 className="card-title" style={{ fontSize: '3em'}}>Login</h3>
                        <p>Glad you're back!</p>
                        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                            <button type="submit" className="btn w-100 btn-primary btn-block mt-3 justify-content-center align-items-center">Login</button>
                        </form>
                        <a href="#" className="text-white mt-3">Forgot Password?</a>
                        {/* <div className="mt-3">
                            <p>Or</p>
                            <button className="btn btn-outline-light mr-2">
                                <img alt="google_login" src={googleImage} className="login-media google" />
                            </button>
                            <button className="btn btn-outline-light">
                                <img alt="facebook_login" src={facebookImage} className="login-media facebook" />
                            </button>
                        </div> */}
                        <div className="mt-3">
                            <a href="#" className="text-white"> Terms & Conditions</a> |
                            <a href="#" className="text-white"> Support</a> |
                            <a href="#" className="text-white"> Customer Care</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

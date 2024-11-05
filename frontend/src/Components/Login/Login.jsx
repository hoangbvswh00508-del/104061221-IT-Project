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
        <div className="main">
            <div className="company_name">
                <h1>KSE OFFICE SALE</h1>
                <div className="text_box">
                    <p className='text_login'>Big office, big company</p>
                </div>
            </div>          
            <div className ='container'>
                <div className ="header">
                    <div className="text">{action}</div>
                    <p className="headerText">Glad you're back!</p>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input 
                            type="text" 
                            placeholder='Username' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input 
                            type="password" 
                            placeholder='Password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="submit-container">
                    <div className="submit" onClick={handleLogin}>Login</div>
                </div> 
                <div className="forgot-password"><span>Forgot Password?</span></div>
                <div className="login-footer">
                    <div className="separator">
                        <hr />
                        <span>Or</span>
                        <hr />
                    </div>
                    <div className="social-login">
                        <button className="google_login">
                            <img alt="google_login" src={googleImage} className="login-media google" />
                        </button>
                        <button className="facebook_login">
                            <img alt="facebook_login" src={facebookImage} className="login-media facebook" />
                        </button>
                    </div>
                    <div className="footer-links">
                        <a href="#">Terms & Conditions</a>
                        <a href="#">Support</a>
                        <a href="#">Customer Care</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;

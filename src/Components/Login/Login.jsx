import React, { useState } from 'react'
import './Login.css'
import loginImage from './Login_home.jpg';
import googleImage from './google-logo.png';
import facebookImage from './facebook-logo.png';

import user_icon from '../Assets/user.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

const Login = () => {

    const [action, setAction] = useState('Login');

    return (
        <div className="main">
            <div className="company_name">
                <h1>KSE OFFICE SALE</h1>
                <div class="text_box">
                    <p className='text_login'>Big office, big company</p>
                </div>
            </div>  
            <img alt="login_image" src={loginImage} className="login-image" />
            
            <div className ='container'>
                <div className ="header">
                    <div className="text">{action}</div>
                    <p className="headerText">Glad you're back!</p>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {action=="Login"?<div></div>:<div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder='Name'/>
                    </div>}
                    
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder='Email'/>
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input type="password" placeholder='Password'/>
                    </div>
                </div>
                <label class="remember-me">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Remember me
                </label>

            
                <div className="submit-container">
                    {/* <div className={action=="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div> */}
                    <div className={action=="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
                </div> 
                {action=="Sign Up"?<div></div>: <div className="forgot-password"><span>Forgot Password?</span></div>}       



                <div class="login-footer">
                <div class="separator">
                    <hr />
                    <span>Or</span>
                    <hr />
                </div>
                <div class="social-login">
                    <button class="google_login">
                        <img alt="google_login" src={googleImage} className="login-media google" />
                    </button>
                    <button class="facebook_login">
                        <img alt="facebook_login" src={facebookImage} className="login-media facebook" />
                    </button>
                </div>
                <p>Don’t have an account? <a href="#">Signup</a></p>
                <div class="footer-links">
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Support</a>
                    <a href="#">Customer Care</a>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Login

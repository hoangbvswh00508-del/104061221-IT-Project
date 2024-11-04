import React, { useState } from 'react'
import './Login.css'
import loginImage from './Login_home.jpg';

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
            
                <div className="submit-container">
                    {/* <div className={action=="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div> */}
                    <div className={action=="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
                </div> 
                {action=="Sign Up"?<div></div>: <div className="forgot-password"><span>Forgot Password?</span></div>}         
            </div>
          
        </div>
    )
}

export default Login

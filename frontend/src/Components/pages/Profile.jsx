import React, { useState, useEffect } from 'react';
import './styles/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNum: '',
    role: '',
    password: '',
    verify: false,
  });
  const [otp, setOtp] = useState(''); 
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/get-user-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data) {
          console.log('Received user data:', data);
          console.log('Email verified status:', data.verify);
          setUserData({
            username: data.username,
            email: data.email,
            phoneNum: data.phoneNum,
            role: data.role,
            password: data.password,
            verify: data.verify,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const sendOtp = async () => {
    try {
      const trimmedEmail = userData.email.trim();
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await response.json();
      if (data.message) {
        setMessage('OTP sent to your email');
      } else {
        setMessage('Error sending OTP');
      }
    } catch (error) {
      setMessage('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const trimmedEmail = userData.email.trim();
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, otpEntered: enteredOTP }),
      });
  
      const data = await response.json();
      
      if (data.message) {
        setIsVerified(true);
        setUserData(prevState => {
          console.log('Updating user data with verify: true');
          return {
            ...prevState,
            verify: true,
          };
        });
        setMessage('Your email has been verified!');
      } else {
        setMessage('Invalid OTP');
      }
    } catch (error) {
      setMessage('Error verifying OTP');
    }
  };
  
  

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-5 align-items-center justify-content-center avatar-container">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <img src="https://via.placeholder.com/300x400" alt="avatar" />
          </div>
          <div className="role-upload-btn md-3 align-items-center justify-content-center">
            <button className="btn btn-primary">Upload Avatar</button>
          </div>
        </div>

        <div className="col-md-7 d-flex align-items-center justify-content-center" id="form">
          <form className="col-md-8">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control border-dark" id="username" value={userData.username} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control border-dark" id="email" value={userData.email} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control border-dark" id="phone" value={userData.phoneNum} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <input type="text" className="form-control border-dark" id="role" value={userData.role} readOnly />
            </div>

            {/* Show 'Verify Email' button if email is not verified */}
            {!userData.verify && (
              <div className="mb-3">
                <label htmlFor="emailVerify" className="form-label">Your email has not been verified</label>
                <button type="button" onClick={sendOtp} className="btn btn-warning" id="emailVerify">Send OTP verification to your Email</button>
              </div>
            )}

            {/* OTP verification section */}
            {!userData.verify && (
              <>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control border-dark"
                    id="otp"
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value)} 
                    placeholder="Enter OTP sent to your email"
                  />
                </div>
                <div className="mb-3">
                  <button type="button" onClick={verifyOtp} className="btn btn-success">Verify OTP</button>
                </div>
              </>
            )}

            {/* Show messages */}
            {message && <p className="text-danger">{message}</p>}
            {isVerified && <p className="text-success">Your email is verified!</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

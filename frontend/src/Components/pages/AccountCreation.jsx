import React, { useState } from 'react';
import axios from 'axios';

const AccountCreation = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setphoneNum] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleCreateAccount = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError("No token found. Please log in as an admin first.");
                setMessage('');
                return;
            }
            console.log("Creating account with data:", { username, password, email });

            const response = await axios.post(
                'http://localhost:5000/create-account',
                { username, password, email },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                setUsername('');
                setPassword('');
                setEmail('');
                setphoneNum('');
                setMessage(response.data.message);
                setError('');
            }

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Failed to create account');
            } else {
                setError('Network error');
            }
            setMessage('');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div 
                className='card col-md-6'
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.5)"
                }}    
            >
                <div className='card-body ml-3'>
                    <h2 className='card-title'>Create a New Account</h2>
                    <div className='form-group mb-2'>
                        <label className='col-sm-3 col-form-label'>Username:</label>
                        <input
                            type="text"
                            className='col-sm-4'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='col-sm-3 col-form-label'>Password:</label>
                        <input
                            type="password"
                            className='col-sm-4'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='col-sm-3 col-form-label'>Email:</label>
                        <input
                            type="email"
                            className='col-sm-4'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='col-sm-3 col-form-label'>Phone Number:</label>
                        <input
                            type="phoneNum"
                            className='col-sm-4'
                            value={phoneNum}
                            onChange={(e) => setphoneNum(e.target.value)}
                        />
                    </div>
                    <button onClick={handleCreateAccount}>Create Account</button>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default AccountCreation;

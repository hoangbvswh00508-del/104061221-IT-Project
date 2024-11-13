import React, { useState } from 'react';
import axios from 'axios';

const AccountCreation = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleCreateAccount = async () => {
        try {
            // Get token from local storage (assuming it's saved there after login)
            const token = localStorage.getItem('token');

            if (!token) {
                setError("No token found. Please log in as an admin first.");
                return;
            }

            // Send a request to the create-account endpoint
            const response = await axios.post(
                'http://localhost:5000/create-account',
                { username, password },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Display a success message or handle response
            setMessage(response.data.message);
            setError(null); // Clear any previous errors
        } catch (err) {
            // Display error message if request fails
            if (err.response) {
                setError(err.response.data.message || 'Failed to create account');
            } else {
                setError('Network error');
            }
            setMessage(''); // Clear any previous success messages
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className='card col-md-6'>
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
                            value={password}
                            // onChange={(e) => setPassword(e.target.value)}
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

import React, { useState } from 'react';
import axios from 'axios';

const Sendmsg = ({ addMessage }) => {
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError('No token found');
        return;
      }
      const userEmail = await getLoggedInUserEmail(token);
      if (userEmail === to) {
        setError("You cannot send a message to yourself.");
        return;
      }

      console.log('Getting user ID by email:', to);
      const receiverId = await getUserIdByEmail(to);
      console.log('Receiver ID:', receiverId);

      if (!receiverId) {
        setError('Invalid email address or user not found');
        return;
      }

      await axios.post('http://localhost:5000/send-message', {
        receiver_id: receiverId,
        subject,
        body,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Message sent successfully');
      addMessage(body); 
      setBody('');
      setSubject('');
      setTo('');
      setError(''); 
      setSuccessMessage("Message sent successfully!");

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message. Please try again.');
    }
  };

  const getLoggedInUserEmail = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/get-user-data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.email;
    } catch (error) {
      console.error('Error fetching logged-in user email:', error);
      setError('Error fetching user information');
      return null;
    }
  };

  const getUserIdByEmail = async (email) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError('No token found');
        return null;
      }

      const response = await axios.get(`http://localhost:5000/get-user-id-by-email`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { email },
      });
      console.log('getUserIdByEmail response:', response.data);
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user by email", error);
      setError('Error fetching user information');
      return null;
    }
  };

  return (
    <div className="w-200">
      <div>
        <div className="col-md-12 w-100">
          <h4 className="mb-4">Compose Message</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="to">To</label>
              <input
                type="email"
                className="form-control mt-1"
                id="to"
                placeholder="Enter email address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="form-control mt-1"
                id="subject"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="body">Body</label>
              <textarea
                className="form-control mt-1"
                id="body"
                rows="10"
                placeholder="Enter message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex align-items-center mt-3">
              <button type="submit" className="btn btn-primary">Send</button>
              <div>
                <button type="button" className="btn btn-light me-2">A</button>
                <button type="button" className="btn btn-light me-2">😊</button>
                <button type="button" className="btn btn-light me-2">📎</button>
                <button type="button" className="btn btn-light">📷</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sendmsg;

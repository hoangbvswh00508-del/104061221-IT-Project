import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/message.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        console.log('Fetching messages with token:', token);

        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await axios.get('http://localhost:5000/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const fetchedMessages = response.data;
        console.log('Fetched Messages:', fetchedMessages);

        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No auth token found");
      }
  
      const response = await axios.delete(`http://localhost:5000/delete-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log(`Message with ID ${id} deleted successfully:`, response.data);
      setMessages(messages.filter((message) => message.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  
  return (
    <div className="center-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="message-box">
              <div className="message-header">
                <div className='fw-bold fs-2'>Messages</div>
              </div>
              <div className="message-body">
                {messages.length > 0 ? (
                  <>
                    {messages.map((message, index) => (
                      <div key={index} className="message-item mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <img
                              src={`http://localhost:5000${message.sender_avatar}`}
                              alt="avatar"
                              className="avatar-img"
                            />
                            <div>
                              <div className='fw-bold'>{message.sender_username}</div>
                              <div className="text-muted">{new Date(message.created_at).toLocaleString()}</div>
                            </div>
                          </div>
                          <button
                            className="delete-btn"
                            onClick={() => deleteMessage(message.id)}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="mt-2">
                          <div className="fw-bold">{message.subject}</div>
                          <div>{message.body}</div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div>No messages</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

import React, { useEffect, useState } from 'react';
import './notification.css';

const Notification = ({ newMessages, oldMessages }) => {
  const [storedNewMessages, setStoredNewMessages] = useState([]);

  useEffect(() => {
    const savedNewMessages = JSON.parse(localStorage.getItem('newMessages')) || [];
    setStoredNewMessages(savedNewMessages);
  }, []);

  useEffect(() => {
    if (newMessages.length > 0) {
      const updatedMessages = [...newMessages, ...storedNewMessages];
      localStorage.setItem('newMessages', JSON.stringify(updatedMessages));
      setStoredNewMessages(updatedMessages);
    }
  }, [newMessages]);

  const navigateToMessages = () => {
    window.location.href = '/messages';
  };

  return (
    <div className="notification-container">
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div className='fw-bold fs-2'>Notification</div>
        <span className='navigate-text' onClick={navigateToMessages} style={{ cursor: 'pointer', color: 'blue' }}>
          See all
        </span>
      </div>
      {storedNewMessages.length > 0 && (
        <>
          <div className='fw-bold mb-3'>New</div>
          {storedNewMessages.map((message, index) => (
            <div key={index} className="mb-3 noti-item new-message">
              <div className="d-flex">
                <div className='fw-bold'>{message.sender}</div>
                <div className="text-muted">{message.time}</div>
              </div>
              <div>{message.text}</div>
            </div>
          ))}
        </>
      )}
      <div className='fw-bold mb-3'>Old</div>
      {oldMessages.map((message, index) => (
        <div key={index} className="mb-3 noti-item old-message">
          <div className="d-flex">
            <div className='fw-bold'>{message.sender}</div>
            <div className="text-muted">{message.time}</div>
          </div>
          <div>{message.text}</div>
        </div>
      ))}
    </div>
  );
};

export default Notification;

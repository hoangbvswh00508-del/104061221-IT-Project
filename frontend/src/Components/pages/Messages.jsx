import React, { useState, useEffect } from 'react';
import './styles/message.css';

const Messages = () => {
  const [newMessages, setNewMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [showNewMessages, setShowNewMessages] = useState(true);

  useEffect(() => {
    const storedNewMessages = JSON.parse(localStorage.getItem('newMessages')) || [];
    const storedOldMessages = JSON.parse(localStorage.getItem('oldMessages')) || [];

    setNewMessages(storedNewMessages);
    setOldMessages(storedOldMessages);
  }, []);

  return (
    <div className="center-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="message-box">
              <div className="message-header">
                <div className='fw-bold fs-2'>Notification</div>
                <div className='d-flex flex-column mt-2 mb-2'>
                  <div className=''>
                    <button onClick={() => setShowNewMessages(true)} className={`btn ${showNewMessages ? 'btn-primary' : 'btn-secondary'} me-2`}>New</button>
                    <button onClick={() => setShowNewMessages(false)} className={`btn ${!showNewMessages ? 'btn-primary' : 'btn-secondary'} ms-2`}>Old</button>
                  </div>
                </div>
              </div>
              <div className="message-body">
                {showNewMessages ? (
                  <>
                    {newMessages.length > 0 ? (
                      <>
                        <div className='fw-bold mb-3'>New</div>
                        {newMessages.map((message, index) => (
                          <div key={index} className="message-item mb-3 new-message">
                            <div className="d-flex justify-content-between">
                              <div className='fw-bold'>{message.sender}</div>
                              <div className="text-muted">{message.time}</div>
                            </div>
                            <div>{message.text}</div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div>No new messages</div>
                    )}
                  </>
                ) : (
                  <>
                    {oldMessages.length > 0 ? (
                      <>
                        <div className='fw-bold mb-3'>Old</div>
                        {oldMessages.map((message, index) => (
                          <div key={index} className="message-item mb-3 old-message">
                            <div className="d-flex justify-content-between">
                              <div className='fw-bold'>{message.sender}</div>
                              <div className="text-muted">{message.time}</div>
                            </div>
                            <div>{message.text}</div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div>No old messages</div>
                    )}
                  </>
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

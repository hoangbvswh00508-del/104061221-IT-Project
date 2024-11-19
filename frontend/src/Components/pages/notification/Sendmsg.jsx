import React, { useState } from 'react';

const Sendmsg = ({ addMessage, handleCloseSendmsg }) => {
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addMessage(body);
    setBody('');
    handleCloseSendmsg();
  };

  return (
    <div className="w-200">
      <div className="">
        <div className="col-md-12 w-100">
          <h4 className="mb-4">Compose Message</h4>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="to">To</label>
              <input type="email" className="form-control mt-1" id="to" placeholder="Enter email address" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="subject">Subject</label>
              <input type="text" className="form-control mt-1" id="subject" placeholder="Enter subject" />
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

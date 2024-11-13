import React from 'react';
import './notification.css';

const Notification = () => {
  return (
    <div className=''>
      <div className="mb-3 noti-item">
        <div className="d-flex">
          <div className='fw-bold'>Viet Hoang</div>
          <div className="text-muted">12m</div>
        </div>
        <div>Hello!!!</div>
      </div>
      <div className="mb-3 noti-item">
        <div className="d-flex">
          <div className='fw-bold'>Minh Duc</div>
          <div className="text-muted">1hr</div>
        </div>
        <div>Can I ask u something</div>
      </div>
      <div className="mb-3 noti-item">
        <div className="d-flex">
          <div className='fw-bold'>Hai Zuoc</div>
          <div className="text-muted">1d</div>
        </div>
        <div>U have picture of this apartment ?</div>
      </div>
      <div className="mb-3 noti-item">
        <div className="d-flex">
          <div className='fw-bold'>Nhat Minh</div>
          <div className="text-muted">2d</div>
        </div>
        <div>Please send me some info</div>
      </div>
    </div>
  );
};

export default Notification;

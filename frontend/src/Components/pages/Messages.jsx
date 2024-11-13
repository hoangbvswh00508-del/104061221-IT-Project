import React from 'react'
import './styles/message.css'

const Messages = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>History Order</h5>
              <span>23 - 30 March 2020</span>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>NEWEST</h6>
                <div className="d-flex justify-content-between">
                  <div>Office 1</div>
                  <div>- $2,500</div>
                </div>
                <div className="text-muted">27 March 2020, at 12:30 PM</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Office 2</div>
                  <div>+ $2,000</div>
                </div>
                <div className="text-muted">27 March 2020, at 04:30 AM</div>
              </div>
              <h6>YESTERDAY</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Office 3</div>
                  <div>+ $750</div>
                </div>
                <div className="text-muted">26 March 2020, at 13:45 PM</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Office 4</div>
                  <div>+ $1,000</div>
                </div>
                <div className="text-muted">26 March 2020, at 12:30 PM</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Office 5</div>
                  <div>+ $2,500</div>
                </div>
                <div className="text-muted">26 March 2020, at 08:30 AM</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Office 6</div>
                  <div>Pending</div>
                </div>
                <div className="text-muted">26 March 2020, at 05:00 AM</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Message</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Viet Hoang</div>
                  <div className="text-muted">12m</div>
                </div>
                <div>Hello!!!</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Minh Duc</div>
                  <div className="text-muted">1hr</div>
                </div>
                <div>Can I ask u something</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Hai Zuoc</div>
                  <div className="text-muted">1d</div>
                </div>
                <div>U have picture of this apartment ?</div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>Nhat Minh</div>
                  <div className="text-muted">2d</div>
                </div>
                <div>Please send me some info</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages

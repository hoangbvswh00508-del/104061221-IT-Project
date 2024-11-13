import React from 'react'
import './styles/profile.css'
const Profile = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-5 align-items-center justify-content-center avatar-container">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <img src="https://via.placeholder.com/300x400" alt='avatar' />
          </div>
          <div className="role-upload-btn md-3 align-items-center justify-content-center">
            <div className="dropdown">
              <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                User Role
              </button>
              <ul className="dropdown-menu" aria-labelledby='dropdownMenuButton1'>
                <li><a className="dropdown-item" href="#">Admin</a></li>
                <li><a className="dropdown-item" href="#">User</a></li>
                <li><a className="dropdown-item" href="#">Client</a></li>
              </ul>
              <button className="btn btn-primary">Upload Avatar</button>
            </div>    
          </div>
          <div className="md-2">
                <label for="description" className="form-label">Description</label>
                <textarea className="form-control border-dark" id="description" rows="5"></textarea>
          </div>
        </div>
        <div className="col-md-7 d-flex align-items-center justify-content-center" id="form">
          <form className="col-md-8">
            <div className="mb-3">
                <label for="username" className="form-label">Username</label>
                <input type="text" className="form-control border-dark" id="username" value="yANCHUI" />
            </div>
            <div className="mb-3">
                <label for="email" className="form-label">Email</label>
                <input type="email" className="form-control border-dark" id="email" value="yanchui@gmail.com" />
            </div>
            <div className="mb-3">
                <label for="phone" className="form-label">Phone Number</label>
                <input type="tel" className="form-control border-dark" id="phone" value="+14987889999" />
            </div>
            <div className="mb-3">
                <label for="password" className="form-label">Password</label>
                <input type="password" className="form-control border-dark" id="password" value="evFTbyVVCd" />
            </div>
            <div className="mb-3">
                <label for="company" className="form-label">Company</label>
                <input type="text" className="form-control border-dark" id="company" />
            </div>
            <div className="mb-3">
                <label for="companyEmail" className="form-label">Company Email</label>
                <input type="email" className="form-control border-dark" id="companyEmail" />
            </div>
            <div className="mb-3">
                <label for="companyHotline" className="form-label">Company Hotline</label>
                <input type="tel" className="form-control border-dark" id="companyHotline" />
            </div>            
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

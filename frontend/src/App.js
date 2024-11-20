import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Dashboard from './Components/pages/Dashboard.jsx';
import AccountCreation from './Components/pages/AccountCreation.jsx';
import Messages from './Components/pages/Messages';
import Profile from './Components/pages/Profile';
import Order from './Components/pages/Order';
import Role from './Components/pages/Role';
import Navbar from './Components/Appbar/Navbar';


function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/accountCreate" element={<AccountCreation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order" element={<Order />} />
        <Route path="/role" element={<Role />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

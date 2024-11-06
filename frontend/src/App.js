import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Dashboard from './Components/pages/dashboard';
import AccountCreation from './Components/pages/AccountCreation.jsx';

function App() {
  return (
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accountCreate" element ={<AccountCreation/>} />
    </Routes>
</Router>
  );
}

export default App;

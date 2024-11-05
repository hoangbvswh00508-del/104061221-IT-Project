import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Navbar from './Components/components/Navbar';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Order from './Components/pages/Order';
import Messages from './Components/pages/Messages';
import Analytics from './Components/pages/Statistics';
import Profile from './Components/pages/Profile';
import Role from './Components/pages/Role';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <Router>
    <Login/>
    <div className="App"> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/order" element={<Order />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/role" element={<Role />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;

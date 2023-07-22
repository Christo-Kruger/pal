import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Logo from '../media/logo.png';

function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-page-container">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo-image" />
      </div>
      <div className="content-container">
        <div className="text-container">
          <h1>Welcome to Jlee Reservations</h1>
        </div>
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="register-button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

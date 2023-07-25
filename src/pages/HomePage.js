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
        <p>By logging and/or registering, you agree to 
        <a href="/개인정보_보호정책_및_이용_약관.pdf" target="_blank" rel="noopener noreferrer"> these term, conditions and privacy guideliness</a>
        </p>
      </div>
    </div>
  );
}

export default HomePage;

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
          <h1>J Lee 예약에 오신 것을 환영합니다.</h1>
        </div>
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>
          로그인
          </button>
          <button className="register-button" onClick={handleRegister}>
          회원가입
          </button>
        </div>
        <p className='terms'>로그인 및 등록을 통해 귀하는 다음에 동의하게 됩니다 
        <a href="/개인정보_보호정책_및_이용_약관.pdf" target="_blank" rel="noopener noreferrer"> 본 이용약관 및 개인정보 보호 지침</a>
        </p>
      </div>
    </div>
  );
}

export default HomePage;

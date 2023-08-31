import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Logo from "../media/logo.png";

function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home-page-container">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo-image" />
      </div>
      <div className="content-container">
        <div className="text-container">
          <h1>J LEE 신입생 설명회 예약</h1>
          <h5>회원가입 후 예약을 진행하여 주시기 바랍니다</h5>
        </div>
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
          <button className="register-button" onClick={handleRegister}>
            회원가입
          </button>
        </div>
        <p className="terms">
        회원가입을 통해 다음에 동의하게 됩니다. <br></br>
        <a
            href="/개인정보_보호정책_및_이용_약관.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            개인정보 수집 및 이용
          </a>
        </p>
      </div>
    </div>
  );
}

export default HomePage;

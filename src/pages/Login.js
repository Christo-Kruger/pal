import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";
import { useAuth } from "../context/AuthContext";
import Logo from "../media/logo.png";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      console.log(backendURL);
      const response = await fetch(`${backendURL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);

        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userCampus", data.campus);

        if (data.role === "parent") {
          navigate("/parent");
        } else if (data.role === "admin" || data.role === "superadmin") {
          navigate("/admin");
        } else {
          setErrorMessage("Invalid role");
        }
      } else {
        const errorData = await response.json();
        console.error(errorData);
        setErrorMessage("Invalid phone or password");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="logo-container">
        <Link to="/">
          <img src={Logo} alt="Logo" className="logo-image" />
        </Link>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-title">로그인</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            전화번호
          </label>
          <input
            className="form-input"
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="password">
            비밀번호:
          </label>
          <div className="password-container">
            <input
              className="form-input"
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "숨다" : "보기"}
            </div>
          </div>
        </div>
        <div className="form-field">
          <button className="form-button" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
        <p className="link">
          아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
        <p className="link">
        비밀번호를 잊으셨나요? <Link to="/change-password">비밀번호 변경</Link>
      </p>
      </form>
    </div>
  );
}

export default LoginForm;

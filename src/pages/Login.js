import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";
import backendURL from "../config";
import { useAuth } from "../context/AuthContext";
import Logo from "../media/logo.png";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendURL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);

        if (data.role === "parent") {
          navigate("/parent");
        } else if (data.role === "admin") {
          navigate("/admin");
        } else {
          alert("Invalid role");
        }
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
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
        <h1 className="form-title">Login</h1>
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email:
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="password">
            Password:
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <button className="form-button" type="submit">
            Login
          </button>
        </div>
        <p className="link">
          Not registered? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;

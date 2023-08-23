import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";

import { useAuth } from "../context/AuthContext";
import Logo from "../media/logo.png";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear the error message

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      console.log(backendURL);
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
        
        localStorage.setItem("userCampus", data.campus);

        if (data.role === "parent") {
          navigate("/parent");
        } else if (data.role === "admin" || "superadmin") {
          navigate("/admin");
        } else {
          setErrorMessage("Invalid role"); // Set error message instead of alert
        }
      } else {
        const errorData = await response.json();
        console.error(errorData);
        setErrorMessage("Invalid email or password"); // Set error message instead of alert
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid email or password"); // Set error message instead of alert
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
        {/* Display error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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

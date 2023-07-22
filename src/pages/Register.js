import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegistrationForm.css";
import backendURL from "../config";
import Logo from "../media/logo.png";

function RegistrationForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [campus, setCampus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendURL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, campus }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        if (data.role === "parent") {
          navigate("/parent", { replace: true });
        } else if (data.role === "admin") {
          navigate("/admin", { replace: true });
        }
      } else {
        const errorData = await response.json();
        console.error(errorData);
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
        <h1 className="form-title">Register</h1>
        <div className="form-field">
          <label className="form-label" htmlFor="name">
            Name:
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <label className="form-label" htmlFor="phone">
            Phone:
          </label>
          <input
            className="form-input"
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <label>
          What campus are you intrested in?
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            required
          >
            <option value="">--Please choose an option--</option>
            <option value="Suji">Suji</option>
            <option value="Dongtan">Dongtan</option>
            <option value="Bundang">Bundang</option>
          </select>
        </label>
        <div className="form-field">
          <button className="form-button" type="submit">
            Register
          </button>
        </div>
        <p className="link">
          Have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default RegistrationForm;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegistrationForm.css";
import ChildForm from "../components/ChildForm";
import Logo from "../media/logo.png";

function RegistrationForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [campus, setCampus] = useState("");
  const [showChildForm, setShowChildForm] = useState(false);
  const [parentId, setParentId] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const backendURL = process.env.REACT_APP_BACKEND_URL;
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
        setParentId(data._id);  // Assuming backend returns the user's _id
        setShowChildForm(true);
        setShowRegistrationForm(false);
      } else if (data.role === "admin") {
        navigate("/admin", { replace: true });
      }
    } else {
      const errorData = await response.json();
      console.error(errorData);
    }
};


  return (
    <div className="form-container">
      <div className="logo-container">
        <Link to="/">
          <img src={Logo} alt="Logo" className="logo-image" />
        </Link>
      </div>
      {showRegistrationForm ? (
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
       ) : null}
      <div className="form-container">
      
      {showChildForm && <ChildForm parentId={parentId} />}
    </div>
    </div>
  );
}

export default RegistrationForm;

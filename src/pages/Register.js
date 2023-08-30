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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendURL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone, campus }),
    });

    setLoading(false);

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
      setError(errorData.message || "An error occurred");
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
        <h1 className="form-title">회원가입</h1>
        {error && <p className="error">{error}</p>}
        <div className="form-field">
          <label className="form-label" htmlFor="name">
            
이름:
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
          이메일:
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
          비밀번호:
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
          전화 번호
          </label>
          <input
  className="form-input"
  type="text"
  id="phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  pattern="010[0-9]{8}"
  title="Phone number must be in the format 010XXXXXXXX"
/>
        </div>
        <label>
        어느 캠퍼스에 관심이 있나요?
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            required
          >
            <option value="">
--옵션을 선택해주세요--</option>
            <option value="Suji">Suji</option>
            <option value="Dongtan">Dongtan</option>
            <option value="Bundang">Bundang</option>
          </select>
        </label>
        <div className="form-field">
          <button className="form-button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        <p className="link">
        계정을 갖고있다면 <Link to="/login">여기에 로그인하세요</Link>
        </p>
      </form>
       ) : null}
   {showChildForm && <ChildForm parentId={parentId} />}
    </div>
  );
}

export default RegistrationForm;
